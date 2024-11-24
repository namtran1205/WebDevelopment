const { render } = require('ejs');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const loginController = 
{
    async loginUser (req, res)
    {
        const { mail, password } = req.body;

        try 
        {
            const record = await User.findOne({ email: mail });
            console.log(record); //// debug
            if (record === null) // mail does not exist
            {
                res.locals.parameters = 
                {
                    failure: true
                };
                res.render('login');
            }
            
            bcrypt.compare(password, record.password, async function (err, result)
            {
                if (err)
                {
                    console.error(err);
                    res.render('login');
                    return;
                }

                if (result) // correct password
                {
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
                else // incorrect password
                {
                    res.locals.parameters = 
                    {
                        failure: true
                    };
                    res.render('login');
                }
            })
        } catch (error) {
            console.error(error);
            res.render('login');
        }
    }
}

module.exports = loginController;