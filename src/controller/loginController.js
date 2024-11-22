const { render } = require('ejs');
const User = require('../models/User');

const loginController = 
{
    async loginUser (req, res)
    {
        const { name, password } = req.body;

        try 
        {
            const record = await User.findOne({ fullName: name }); //// add password field when available
            console.log(record); //// debug
            if (record === null)
            {
                res.locals.parameters = 
                {
                    failure: true
                };
                res.render('login');
            }
            else 
            {
                // temporary
                switch (record.type) {
                    case 'subscriber':
                        res.send('subscriber page');
                        break;
                
                    case 'writer':
                        res.send('writer page');
                        break;

                    case 'editor':
                        res.send('editor page');
                        break;

                    case 'admin':
                        res.send('admin page');
                        break;
                        
                    default:
                        console.log('unknown user type');
                        res.redirect('/');
                        break;
                }
            }
        } catch (error) {
            console.log(error);
            res.render('login');
        }
    }
}

module.exports = loginController;