var http = require('http');
var fs = require("fs");

temp_guests = [],
guests_array = [];
guests_csv = "id,name,img,role,url\n",
max = 70,
done = 0,
id = 0;
photo_increment = 0;

fs.mkdir("../data");
fs.mkdir("../img");

for( var i = 1; i <= max; i++ ){

	temp_guests[i] = [];
	pullRecord(i, done);
	
}

function pullRecord(i, done){

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
					pullImage(img, name);
				}
			});
			
			// If we're done, write CSV and JSON files
			if( done == max ){ 
				
				temp_guests.forEach(function(guests){
					guests.forEach(function(guest){
						
						// Increment ID
						id++;
						
						// Push to final guest file
						guests_array.push(guest);
						
						// Add to CSV object.
						guests_csv += id + ",\"" + guest.name + "\",\"" + guest.img + "\",\"" + guest.role + "\",\"" + guest.url + "\"\n";
						
						
					});
				});
				
				
				fs.writeFile( "../data/guests.csv", guests_csv, encoding='utf8', function(err){
					if( err ) throw err;
				});
				
				
				fs.writeFile( "../data/guests.json", JSON.stringify(guests_array), encoding="utf8", function(err){
					if( err ) throw err;	
				});
				
			}

		});
		
	});

	
}

function pullImage(img, name){
	var this_img = img;
	photo_increment++;
		setTimeout(function(){
			console.log(this_img);
			http.get(img, function(response){
				var stream = fs.createWriteStream("../img/" + name + ".jpg");
				response.pipe(stream);

			}).on("error", function(error){
				//console.log(error);
			});	
		}, photo_increment * 500);
		
}
