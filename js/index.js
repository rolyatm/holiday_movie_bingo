/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//https://gist.github.com/DavidBruant/1016007
NodeList.prototype.forEach = Array.prototype.forEach; 
HTMLCollection.prototype.forEach = Array.prototype.forEach;

var width, image_width;

var card = {
    "1_1":{word:null,checked:false},
    "1_2":{word:null,checked:false},
    "1_3":{word:null,checked:false},
    "1_4":{word:null,checked:false},
    "1_5":{word:null,checked:false},
    "2_1":{word:null,checked:false},
    "2_2":{word:null,checked:false},
    "2_3":{word:null,checked:false},
    "2_4":{word:null,checked:false},
    "2_5":{word:null,checked:false},
    "3_1":{word:null,checked:false},
    "3_2":{word:null,checked:false},
    "3_3":{word:null,checked:true},
    "3_4":{word:null,checked:false},
    "3_5":{word:null,checked:false},
    "4_1":{word:null,checked:false},
    "4_2":{word:null,checked:false},
    "4_3":{word:null,checked:false},
    "4_4":{word:null,checked:false},
    "4_5":{word:null,checked:false},
    "5_1":{word:null,checked:false},
    "5_2":{word:null,checked:false},
    "5_3":{word:null,checked:false},
    "5_4":{word:null,checked:false},
    "5_5":{word:null,checked:false}
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('DOMContentLoaded', this.onReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onReady: function() {
        //display app and load setup view
        app.receivedEvent('DOMContentLoaded');
        width = window.innerWidth;
        image_width = Math.floor(width*0.2);
        //set all img and square css
        document.querySelectorAll('img').forEach(function(e,i,a){
            e.style.width=image_width + 'px';
            e.style.height=image_width + 'px';

        });
        document.querySelectorAll('.square').forEach(function(e,i,a){
            e.style.width=image_width + 'px';
            e.style.height=image_width + 'px';

        });
        document.querySelector('.exit').onclick = function() {
            location.reload();
        };
        document.querySelector('.app').style.display='block';
        document.querySelector('.setup').style.display='block';
        setHeader('Hallmark Holiday Movie Bingo!');
    },
    // Log event to console
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

function setHeader(text) {
    var header = document.querySelector('.header');
    header.innerHTML= text;
}

function checkBox(square){
    var s = document.getElementById(square);
    if (card[square].checked) {
	s.style.backgroundColor = '';
	card[square].checked = false;
    } else {
	 s.style.backgroundColor = 'green';
         card[square].checked = true;
    }
}

function checkForComplete(){
    //check to see if the card has been completed by stepping through the card object and checking for pictures
    for (square in card){
        if (card[square].photo===null){
            return false;
        }
    }
    return true;
}

function makeCard(){
    var user_name = document.getElementById('name-user').value;
    if (user_name===''){
        user_name='Santa';
    }
    var category = 'holiday_movies';
    var word_list = [];
    //get our randomly generated list of words for the card
    while (word_list.length < 25) {
        var new_word = assets[category][Math.floor(Math.random() * assets[category].length)];
        if (word_list.indexOf(new_word)===-1){
            word_list.push(new_word);
        }
    }
    var c = 0;
    for (square in card){
        var current = document.getElementById(square);
	if (square === 'center'){
		card[square].word=user_name;
	} else {
        	card[square].word=word_list[c];
        	c++;

        	current.onclick = function () {
            	//take a photo on click
            		checkBox(this.id);
            		// if (checkForComplete()) {
            		//     document.querySelector('.save').disabled = false;
            		// };
        	}
	}
	var name = document.createElement('span');
        name.innerHTML = card[square].word;
        current.appendChild(name);
    }

    document.querySelector('.setup').style.display='none';
    document.querySelector('.main').style.display='block';
    document.querySelector('.exit').style.display='block';

    setHeader(user_name + "'s Card");

}


function saveCard(){
    //we convert the html elements that make up the card into a canvas so we can save
    //setup canvas
    var c = document.getElementById('card');
    var canvas = document.createElement('canvas');
    canvas.id = "save";
    canvas.width = width;
    canvas.height = width;

    var ctx = canvas.getContext('2d');

    //draw each image from the card
    function loadImage(image,x,y,w){
        var img = new Image();
        img.src = image;
        img.onload = function(){
            ctx.drawImage(img,x,y,w,w);
        }
    }
    //topleft
    var x = 0;
    var y = 0;
    //row1
    loadImage(card.topleft.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.topcenter.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.topright.photo,x,y,image_width);
    //row2
    //reset x
    x=0;
    //move y 1 spot
    y+=image_width;
    loadImage(card.middleleft.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.center.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.middleright.photo,x,y,image_width);
    //row 3
    //reset x
    x=0;
    //move y 1 spot
    y+=image_width;
    loadImage(card.bottomleft.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.bottomcenter.photo,x,y,image_width);
    //move x 1 spot
    x+=image_width;
    loadImage(card.bottomright.photo,x,y,image_width);

    var f = canvas.toDataURL();
    window.location=f;

    // var save = new Image();
    // save.src = canvas.toDataURL();
    // save.onload = function() {
    //     window.open(save);        
    // }
    
    // var i = canvas.toDataURL();
    // window.open(i);
    // var code = "var img=document.querySelector('img'); img.src='"+i+"';"
    // console.log(code);
    // var w=window.open('save.html', '_blank', 'location=yes');
    
    // w.addEventListener('loadstop', function() {
    //     w.executeScript({
    //         code: code
    //     });
    // });

    //alert('SAVE');
}
