$(document).ready(function () {

    var myDB;

    var registrationId = 0;

    document.addEventListener("deviceready", onDeviceReady, false);

 

    function onDeviceReady() {

        myDB = window.sqlitePlugin.openDatabase({ name: "mySQLite.db", location: 'default' });

 

        CreatePhoneGapPro();

        RefreshRegistration();

    }

 

    // Create Registration table in Sql Lite DB.

    function CreatePhoneGapPro() {

        myDB.transaction(function (transaction) {

            transaction.executeSql('CREATE TABLE IF NOT EXISTS Registration (Id integer primary key, FirstName text, LastName text)', [],
                function (tx, result) {
                    alert("Table created successfully");
                },

                function (error) {

                    alert("Error occurred while creating the table.");

                });

        });

    }

 

    //Insert New Details (into SQLite Database)

    $("#btnSubmit").click(function () {

        var firstName = $("#txtFirstName").val();

        var lastName = $("#txtLastName").val();

 

        myDB.transaction(function (transaction) {

 

            if (registrationId > 0) {

                myDB.transaction(function (transaction) {

                    var executeQuery = "UPDATE Registration SET FirstName=?, LastName=? WHERE Id=?";

                    transaction.executeSql(executeQuery, [firstName, lastName, registrationId],

                      //On Success

                      function (tx, result) {

                          RefreshRegistration();

                          ClearControl();

                          alert('Updated successfully');

                      },

                      function (error) {

                          alert('Details not updated');

                      });

                });

            }

            else {

 

                var executeQuery = "INSERT INTO Registration (FirstName, LastName) VALUES (?,?)";

                transaction.executeSql(executeQuery, [firstName, lastName]

                    , function (tx, result) {

                        RefreshRegistration();

                        ClearControl();

                        alert('Inserted successfully');

                    },

                    function (error) {

                        alert('Details not Inserted');

                    });

            }

 

        });

    });

 

    // Load Data in Table from SQLite Database.

    function RefreshRegistration() {

        $("#TableData").html("");

        myDB.transaction(function (transaction) {

            transaction.executeSql('SELECT * FROM Registration', [], function (tx, results) {

                var len = results.rows.length, i;

                $("#rowCount").html(len);

                for (i = 0; i < len; i++) {

                    $("#TableData").append("<tr><td>" + results.rows.item(i).Id + "</td><td>" + results.rows.item(i).FirstName + "</td><td>" + results.rows.item(i).LastName + "</td><td><a class='edit' href='#' id='edit_" + results.rows.item(i).Id + "'>Edit</a> &nbsp;&nbsp; <a class='delete' href='#' id='" + results.rows.item(i).Id + "'>Delete</a></td></tr>");

                }

            }, null);

        });

    }

 

    // Get and Set Current Selected data.

    $(document.body).on('click', '.edit', function () {

        var delString = this.id;

 

        var splitId = delString.split("_");

        var curId = splitId[1];

        //alert(curId);

 

        registrationId = parseInt(curId);

 

        if (registrationId > 0) {

            myDB.transaction(function (transaction) {

                transaction.executeSql('SELECT * FROM Registration where Id=?', [registrationId], function (tx, results) {

                    var len = results.rows.length, i;

 

                    if (len > 0) {

                        $("#txtFirstName").val(results.rows.item(0).FirstName);

                        $("#txtLastName").val(results.rows.item(0).LastName);

                    }

                    else {

                        ClearControl();

                    }

                }, null);

            });

        }

    });

 

    // Cancel the current Operation.

    $("#btnCancel").click(function () {

        ClearControl();

    });

 

    // Clear Control

    function ClearControl() {

        registrationId = 0;

        $("#txtFirstName").val("");

        $("#txtLastName").val("");

    }

 

    //Delete Selected Registration data from SQLite Database.

    $(document.body).on('click', '.delete', function () {
        if (confirm("Do you want to delete")) {
            var id = this.id;
            myDB.transaction(function (transaction) {
                var executeQuery = "DELETE FROM Registration where Id=?";
                transaction.executeSql(executeQuery, [id],
                  //Success
                  function (tx, result) {

                      RefreshRegistration();

                      ClearControl();

                      alert('Delete successfully');

                  },

                  //Error

                  function (error) { alert('Data not deleted.'); });

            });

        }

 

    });

});