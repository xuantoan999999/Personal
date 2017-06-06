const async = require("async");
const moment = require("moment");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = function initRolesUserCommand(program) {
    'use strict';

    program
    .command('init')
    .description('Init data')
    .action(function (command) {
        async.waterfall(
            [
            function createAccountAdmin(callback) {
                program.successMessage('Start task....');
                program.successMessage('Step 1/1: Create Admin');
                program.successMessage('Enter info admin accout: ');

                program.prompt.get({
                    properties: {
                        email: {
                            description: 'Enter email\'s admin: ',
                            required: true,
                            pattern: /.+\@.+\..+/,
                            default: 'admin@gmail.com',
                            type: 'string'
                        },
                        phone: {
                            description: 'Enter phone number for admin: ',
                            required: true,
                            default: '0987654321',
                            type: 'string'
                        },
                        password: {
                            description: 'Enter password for admin: ',
                            required: true,
                            hidden: true,
                            replace: '*',
                            default: 'iii3studi1',
                            type: 'string'
                        }
                    }
                }, function (err, input) {
                    if (err) {
                        return program.handleError(err);
                    } else {
                                    // init data
                                    input.status = 1;
                                    input.provider = 'local';
                                    input.name = 'Admin';
                                    input.roles = ['user', 'admin'];
                                    let admin = new User(input);

                                    admin.hashPassword(input.password, function (err, hash) {
                                        admin.password = hash;
                                        admin.activeToken = '';

                                        const promise = admin.save();

                                        promise.then(admin => {
                                            program.successMessage('Account created!');
                                            callback('' + admin._id);
                                        }).catch(err => {
                                            program.errorMessage('Can not create account admin: %s', '' + err);
                                            User.findOne({
                                                phone: input.email
                                            }, function (err, user) {
                                                if (err) callback(null);
                                                else
                                                    callback('' + user._id);
                                            })
                                        });
                                    });
                                }
                            });
            }
            ],
            function setPermissionForAdmin(idAdmin) {
                if (idAdmin === null) {
                    program.errorMessage('Step 6/6: Can not set permission admin');
                    process.exit(1);

                }
                else {
                    // acl.addUserRoles(idAdmin, rolesData, function (err) {
                    //     if (err) {
                    //         program.errorMessage('Can not set permission for admin: %s', '' + err);
                    //         process.exit(1);
                    //     } else {
                            program.successMessage('Step 6/6: set full permission for admin success!');
                            program.successMessage('------------->> Succesfully <<-------------');
                            process.exit(1);
                        // }
                    // })
                }

            });
    });
};
