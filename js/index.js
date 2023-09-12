const form = document.querySelector( ".signup form" );
let error = document.getElementById( "error" );
let name_name = document.getElementById( "name" );
let roll = document.getElementById( "roll" );
let UserNameVerification = localStorage.getItem( "User_Name" );

// Security at startup script

form.onsubmit = (e)=> {
    e.preventDefault();
    document.getElementById( "loader" ).style.display = "block";
    document.getElementById( "wrapper" ).style.display = "none";
    let name_val_first = name_name.value;
    let name_val = name_val_first.trim();
    let roll_val = roll.value;
    if ( roll_val > 0 && roll_val < 45) {
        if ( !( ( name_val.includes( "." ) ) || name_val.includes( "#" ) ) || name_val.includes( "$" ) || name_val.includes( "(" ) || name_val.includes( ")" ) || name_val.includes( "[" ) || name_val.includes( "]" ) ) {
            //Checking password is same from others or not
            let database_ref = firebase.database().ref(); //different because ref added means refernce
            database_ref
                .child( "Users_Data" )
                .orderByChild( "User" )
                .once( "value", function ( snapshot ) {
                    let snap_val = snapshot.val(); // on newer SDKs, this may be snapshot.key
                    var keys = Object.keys( snap_val );
                    // Check if the user's password is same with other password
                    if ( keys.includes( name_val ) ) {
                        alert(
                            "You have already played the quiz, this quiz is meant for playing only one time"
                        );
                        document.getElementById( "loader" ).style.display = "none";
                        document.getElementById( "wrapper" ).style.display = "block";
                        document.getElementById( "name" ).value = "";
                        document.getElementById( "roll" ).value = "";
                    } else {
                        const database = firebase.database();
                        let data = {
                            User: name_val,
                            roll: roll_val,
                            Played: "No"
                        };
                        var ref = database.ref( "Users_Data/" + name_val );
                        ref.set( data );
                        localStorage.setItem( "Played", "No" );
                        // Instantiate an xhr object
                        const xhr = new XMLHttpRequest();

                        // Open the object
                        xhr.open( 'GET', 'quiz.html', true );
                        xhr.send();
                        xhr.getResponseHeader( 'Content-type', 'application/html' );


                        // What to do on progress (optional)
                        xhr.onprogress = function () {
                            document.getElementById( "loader" ).style.display = "block";
                            document.getElementById( "wrapper" ).style.display = "none";
                            console.log( 'On progress' );
                        }

                        // What to do when response is ready
                        xhr.onload = function () {
                            if ( this.status === 200 ) {
                                localStorage.setItem( "verify", name_val );
                                window.location.replace( "quiz.html" );
                            } else {
                                alert( "Server responded 404" );
                                document.getElementById( "loader" ).style.display = "block";
                                document.getElementById( "wrapper" ).style.display = "none";
                            }
                        }
                    }
                } );
        } else {
            document.getElementById( "loader" ).style.display = "none";
            document.getElementById( "wrapper" ).style.display = "block";
            document.getElementById( "error" ).style.display = "block";
            error.innerHTML = `Names can't contain ".", "#", "$", "[", or "]"`;
            setTimeout( () => {
                document.getElementById( "error" ).style.display = "none";
            }, 5000 );
        }
    } else {
        document.getElementById( "error" ).style.display = "block";
        error.innerHTML = "Please type a valid roll no.";
        document.getElementById( "loader" ).style.display = "none";
        document.getElementById( "wrapper" ).style.display = "block";
        setTimeout( () => {
            document.getElementById( "error" ).style.display = "none";
        }, 5000 );
    }
};
