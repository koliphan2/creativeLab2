// $(document) works on the whole document. $() is the area where I am working.
$(document).ready(function() {
    /*
        //Grab an HTML item with the ID weatherSubmit and put it in this variable
        //I can grab a class by period, just like how I find it in the .css
        var submitButton = $("#weatherSubmit");
        
        //when the button is clicked... do things.
        // e is the event handler.. It is the object that gets automatically passed in
        var clickFunction = function(e){
            //The default will automatically do things. Get rid of it so we can work
            e.preventDefault();
            console.log("You clicked me!");
        
            submitButton.click(clickFunction);
        }
    */
   //T
    var setPokemon = function(){
        $("#myPokeName").html(localStorage.getItem("choosedPokemon")); 
        $("#myPokePic").attr("src", "https://img.pokemondb.net/sprites/heartgold-soulsilver/back-normal/" + localStorage.getItem("choosedPokemon") + ".png");
        $("#myPokePic").attr("alt", localStorage.getItem("choosedPokemon"));
    }
    setPokemon();


    //Actual Location of where moves are stored
    var myPokemonStorage = new Vue({
        el: '.moves',
        data: {
            type: '',
            attacks: [],
        }
    });

    //Get moves to set
    console.log("Hello");
    
    var getMoves = function(){
        //For some reason, my API stopped working?!
        var myURL = "https://cors-anywhere.herokuapp.com/http://pokeapi.co/api/v2/pokemon/" + localStorage.getItem("choosedPokemon");
        $.ajax({
            url : myURL,
            dataType: "json",
            success : function(info){
                var moveList = info.moves;
                var allMoves = [];
                console.log("At the geingning");

                var myObject = {
                    name: "",
                    level: ""
                };
                console.log(info.moves);
                //Get all moves that come from level up
                Array.prototype.forEach.call(info.moves, moves => {
                   
                    var checkFunction = function(moveDetails){
                        //Loop through the move to check it's details 
                        var results = Array.prototype.forEach.call(moveDetails.version_group_details, moveDetail =>{
                            //Fill the object with moves that are Level-Up and available in only certain games
                            if(moveDetail.level_learned_at > 0 && moveDetail.version_group.name === "firered-leafgreen"){
                                console.log(moves.move.name);
                                myObject.name = moves.move.name;
                                myObject.level = moveDetail.level_learned_at;
                                console.log(myObject);
                                allMoves.push(myObject);
                                myPokemonStorage.$data.attacks.push(myObject);
                            
                            };
                        });
                        return allMoves;
                    }
                    
                    myPokemonStorage.$data.attacks = checkFunction(moves);
                });
                //myPokemonStorage.$data.attacks = allMoves;
                console.log(allMoves);
                return allMoves;
            }
        });
    }

    getMoves();
    
    $(".attackButton").mouseover(function(e){
        document.getElementById("moveDescription").style.display = 'grid';        
    })

    $(".chosenPokemon").click(function(e) {
        var pokemon = this.alt;
        localStorage.setItem("choosedPokemon", pokemon);
    });
});
