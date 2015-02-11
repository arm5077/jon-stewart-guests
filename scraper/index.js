var http = require('http');
var fs = require("fs");

temp_guests = [],
guests = [];
guests_csv = "id,name,img,role,url\n",
max = 70,
done = 0,
id = 0;

fs.mkdir("../data");
fs.mkdir("../img");

for( i = 1; i <= max; i++ ){

	temp_guests[i] = [];
	pullRecord(i);
	
}

function pullRecord(i){
	http.get( "http://thedailyshow.cc.com/feeds/f1034/1.0/9d84111c-901a-4020-b1e4-c4894da65353/?pageNumber=" + i, function(response){
		var body = "";	
		response.on("data", function(datum){
			body += datum;
		});
		response.on("end", function(){
			
			// Increment 'completed' counter 
			done++;
			
			var parsed = JSON.parse(body);
			parsed.result.personContexts.forEach(function(person){
				
				// assign values
				name = person.name || "";
				img = (person.images[0] ? person.images[0].url : "");
				role = person.shortBio || "";
				url = person.canonicalURL || "";
				
				// Add to temporary object. We do this so they stay in the right order,
				// even if server requests come back at different times
				temp_guests[i].push({ "name": name, "img": img, "role": role, "url": url });
				
				
				// Pull guest image and file
				if( img ){
					http.get(img, function(response){
						var image = '';
						response.setEncoding('binary');
						response.on('data', function(chunk){
							image += chunk;
		    			});
						response.on('end', function(){
							// Route image based on political status
						
							// Write image
							fs.writeFile("../img/" + name + ".jpg", image, 'binary', function(err){
								if( err ) throw err; 
							})
						});
	
					});
				}
				
			});
			// If we're done, write CSV and JSON files
			if( done == max ){ 
				
				temp_guests.forEach(function(guests){
					guests.forEach(function(guest){
						
						// Increment ID
						id++;
						
						// Push to final guest file
						guests.push(guest);
						
						// Add to CSV object.
						guests_csv += id + ",\"" + guest.name + "\",\"" + guest.img + "\",\"" + guest.role + "\",\"" + guest.url + "\"\n";
						
						
					});
				});
				
				
				fs.writeFile( "../data/guests.csv", guests_csv, encoding='utf8', function(err){
					if( err ) throw err;
				});
				
				fs.writeFile( "../data/guests.json", JSON.stringify(guests), encoding="utf8", function(err){
					if( err ) throw err;	
				});
				
			}

		});
		
	});

	
}
