const { render } = require('ejs');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const loginController = 
{
    async loginUser (req, res)
    {
        const { mail, password } = req.body;
        
        try 
        {
            const record = await User.findOne({ email: mail, isVerified: true });
            if (record === null)
            {
                res.locals.parameters = 
                {
                    failure: true
                };
                return res.render('login');
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
                            res.cookie('user', JSON.stringify(record), { httpOnly: true });
                            res.redirect(`/profile/${record.id}`);
                            break;
                    
                        case 'writer':
                            res.cookie('user', JSON.stringify(record), { httpOnly: true });
                            res.redirect(`/profile/${record.id}`);
                            //res.send('writer page');
                            break;
        
                        case 'editor':
                            res.cookie('user', JSON.stringify(record), { httpOnly: true });
                            res.redirect(`/profile/${record.id}`);

                            break;
        
                        case 'admin':
                            res.cookie('user', JSON.stringify(record), { httpOnly: true });
                            res.redirect("/admin");
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