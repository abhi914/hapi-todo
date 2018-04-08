import hapi from 'hapi';
import joi from 'joi';
import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/Todo");

const Schema = mongoose.Schema ;

const TodoSchema = new Schema({
    text: String,
    
});

const todoModel = mongoose.model('todo',TodoSchema);

const server = new hapi.Server();

server.connection({
    host: 'localhost',
    port: 3000
});


server.route([
    {
        method: 'GET',
        path: '/todo',
        handler(request,reply){
            todoModel.find()
                .then(response => {
                    console.log(response)
                    reply(response)
                })
                .catch(err => {
                    console.error(err)
                    reply("NO document exist")
                })
        }

    },
    {
        method: 'GET',
        path: '/todo/{id}',
        config: {
            validate: {
                params: joi.object({
                    id: joi.string().alphanum().required()
                })
            },
            handler(request,reply){
                const {id} = request.params;
                todoModel.findById(id)
                .then(response => {
                    console.log(response)
                    reply(response)
                })
                .catch(err => {
                    console.error(err);
                    reply('document do not exist');
                })    
            
            }
        }
    },
    {
        method: 'POST',
        path: '/todo',
        config: {
            validate: {
                payload: joi.object({
                    text: joi.string().max(100).required()
                })
            },
            handler(request,reply){
                const {text} = request.payload;
                const newTodo = new todoModel({
                    text
                });
                newTodo.save()
                    .then(e => {
                        console.log(e)
                        reply('Succeed');
                })
                .catch(err => {
                    console.error(err);
                    reply('database error');
                })
            }
        }
              
    },
    {
        method: 'PUT',
        path: '/todo/{id}',
        config: {
            validate: {
                params: joi.object({
                    id: joi.string().alphanum().required()
                })
            },
            handler(request,reply){
            
                const {id} = request.params ;
                const {text} = request.payload ;
                todoModel.findByIdAndUpdate(id,{
                    text
                })
                .then(response => {
                    const updatedObject = response;
                    updatedObject.text = text;    
                    
                    reply(updatedObject);
                   
                })
                .catch(err => {
                    console.log(err)
                    reply(err)
                })
           }
    
        
        }
            },
    {
        method: 'DELETE',
        path: '/todo/{id}',
        config: {
            validate: {
                params: joi.object({
                    id: joi.string().alphanum().required()
                })
            },
            handler(request,reply){
                const {id} = request.params;
                todoModel.findByIdAndRemove(id)
                    .then(() => {
                        reply('Document deleted')
                        
                    })
                    .catch(err => {
                        reply(err)
                    })
            }

        }

        
    }
]);

// server.start((err) => {
//     if(err) {
//         console.error(err);
//     }
//     console.log(`server started at ${server.info.uri}`);
// });