// $(document) works on the whole document. $() is the area where I am working.
$(document).ready(function() {
    
    var setPokemon = function(){
        $("#myPokeName").html(localStorage.getItem("choosedPokemon")); 
        $("#myPokePic").attr("src", "https://img.pokemondb.net/sprites/heartgold-soulsilver/normal/" + localStorage.getItem("choosedPokemon") + ".png");
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
    var getMoves = function(){
        var myURL = "https://cors-anywhere.herokuapp.com/http://pokeapi.co/api/v2/pokemon/" + localStorage.getItem("choosedPokemon");
        $.ajax({
            url : myURL,
            dataType: "json",
            success : function(info){
                var moveList = info.moves;
                var allMoves = [];


                var myObject = {
                    name: "",
                    level: ""
                };
                //Get all moves that come from level up
                Array.prototype.forEach.call(info.moves, moves => {

                    var checkFunction = function(moveDetails){
                        //Loop through the move to check it's details 
                        var results = Array.prototype.forEach.call(moveDetails.version_group_details, moveDetail =>{
                            //Fill the object with moves that are Level-Up and available in only certain games
                            if(moveDetail.level_learned_at > 0 && moveDetail.version_group.name === "firered-leafgreen"){
                                var myObject = {
                                    name: moves.move.name,
                                    level: moveDetail.level_learned_at
                                };
                            
                                allMoves.push(myObject);
                                //myPokemonStorage.$data.attacks.push(myObject);
                            };
                        });
                        return allMoves;
                    }
                    
                    myPokemonStorage.$data.attacks = checkFunction(moves);
                });
                //myPokemonStorage.$data.attacks = allMoves;
                return allMoves;
            }
        });
    }

    getMoves();
    
    $("#evolveButton").click(function(e){
        var myURL = "https://cors-anywhere.herokuapp.com/http://pokeapi.co/api/v2/pokemon-species/" + localStorage.getItem("choosedPokemon");
        //Get the species
        $.ajax({
            url : myURL,
            dataType: "json",
            success : function(info){
                var evolution = "https://cors-anywhere.herokuapp.com/" + info.evolution_chain.url;
                //Get the evolution
                $.ajax({
                    url :evolution,
                    dataType: "json",
                    success : function(chain){
                        var evolution;
                        console.log("This is my array");
                        console.log(chain.chain.evolves_to);
                        evolution = chain.chain.evolves_to[0].species.name;
                        console.log(evolution);
                        localStorage.setItem("choosedPokemon", evolution[0]);
                    }
                })
            }
        })
        window.location.reload(true);
    });
    

    $(".chosenPokemon").click(function(e) {
        var pokemon = this.alt;
        localStorage.setItem("choosedPokemon", pokemon);
    });
});
