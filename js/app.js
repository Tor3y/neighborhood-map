

// Map script creation
function buildMap() {
	var mapScript = document.createElement('script');
	mapScript.type = 'text/javascript';
	mapScript.async = true;
	mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBdPs-DH6pWE-_DYa6jKEGBYtgcWvDW6-Q&callback=initMap';
	mapScript.onerror = function() {
		console.log("Oopps were having trouble loading google maps API");
		alert("looks like were not loading google maps API");
	}
	document.body.appendChild(mapScript);
}

// Point of interest objects
var pointsOfInterest = [
	{
		title: 'Portola Coffee Lab',
		categories: ['coffee','espresso','cafe'],
		poiLat: 33.694459,
		poiLng: -117.925732,
		streetAddr: '3313 Hyland Ave',
		cityAddr: 'Costa Mesa, CA 92626',
		imgSrc: 'https://c2.staticflickr.com/8/7019/6675511973_7390781666_b.jpg',
		blurb: 'FROM THE FARM, TO OUR ROASTER, TO OUR BARISTA, AND FINALLY TO YOU... WE OBSESS OVER EVERY PROCESS ALONG THE WAY.  ITS ONLY THROUGH THIS DEGREE OF PASSION AND DEDICATION THAT WE ACHIEVE THE COFFEE QUALITY THAT HAS BECOME THE PORTOLA STANDARD.',
		index: 0,
		gMarker: {}
	},
	{
		title: 'Neat Coffee',
		categories: ['coffee','espresso','cafe'],
		poiLat: 33.678956,
		poiLng: -117.875633,
		streetAddr: '270 Baker St E #200',
		cityAddr: 'Costa Mesa, CA 92626',
		imgSrc: 'http://www.iheartcostamesa.com/wp-content/uploads/2015/12/iHeartCostaMesa_NeatCoffee_SliderFeatured-1000x640.jpg',
		blurb: 'Coffe made with love',
		index: 1,
		gMarker: {}
	},
	{
		title: 'Coffee Bean & Tea Leaf',
		categories: ['coffee','espresso','cafe'],
		poiLat: 33.629190,
		poiLng: -117.906441,
		streetAddr: '1128 Irvine Ave',
		cityAddr: 'Newport Beach, CA 92660',
		imgSrc: 'http://thepurplepassport.com/wp/wp-content/uploads/2010/07/CoffeeBeanandTeaLeaf052510-01-masterwits-cc-390x235.jpg',
		blurb: 'At The Coffee Bean & Tea Leaf, the art of crafting the best tasting coffee requires respecting each individual roast. Knowing the specific origin and roast degree for each coffee allows for intense flavor that can be traced back to its earliest beginnings.',
		index: 0,
		gMarker: {}
	},
	{
		title: 'Peets Coffee',
		categories: ['coffee','espresso','cafe'],
		poiLat: 33.684797,
		poiLng: -117.810948,
		streetAddr: 'Crossroads Trading Co., 3972 Barranca Pkwy F-2',
		cityAddr: 'Irvine, CA 92606',
		imgSrc: 'http://mms.businesswire.com/media/20140128005571/en/400878/5/Peets-Chestnut-102.jpg',
		blurb: 'Refreshing, tropical coconut is coming to Peets summer beverage menu. Kicking off the Summer is a twist on a Peets favorite, the Coconut Black Tie. Cold brewed Baridi Blend is …',
		index: 3,
		gMarker: {}
	},
	{
		title: 'Pauls Coffee Shop',
		categories: ['coffee','cafe'],
		poiLat: 33.716822,
		poiLng: -117.963587,
		streetAddr: '16947 Bushard St',
		cityAddr: 'Fountain Valley, CA 92708',
		imgSrc: 'https://res.cloudinary.com/roadtrippers/image/upload/c_fill,h_316,w_520/v1361667407/pauls-coffee-shop-4f6d10c946d09d558f00015f.jpg',
		blurb: 'Militay themed coffee shop',
		index: 4,
		gMarker: {}
	}
];

// Gloabal info for infoWindow
var infoWIndowIndex = 0;

// Gloabal info on viewport
var viewport = {
    width  : $(window).width(),
    height : $(window).height()
};

$(document).ready(function () {
	$("#toggle").click(function () {
		if ($(this).data('name') == 'show') {
			$("#searchMenu").animate({width: 0},500);
			setTimeout(function() {$("#searchMenu").hide();}, 500); 
			$(this).data('name', 'hide');
			$(this).html("&#8680;");
		} else {
			$("#searchMenu").animate({
				width: '100%'
			},500).show();
			$(this).data('name', 'show');
			$(this).html("&#8678;");
		}
	});
});

var generateContentString = function (poiReturned) {

  var consumerKey = "R9P1G_amYFdC5Uo14SeMHw"; 
	var consumerSecret = "ca1mp3HeWZy2ZK-SkHxhMm_f8Wk";
	var accessToken = "CZzMTRD-t9h-PccH-2rVUCeaa-SetctZ";
	var accessTokenSecret = "yL7XOcZhr_148DFeoCVkRrIl6gA";

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = "http://api.yelp.com/v2/search/";

    var parameters = {
        oauth_consumer_key: consumerKey,
        oauth_token: accessToken,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb',
        term: 'coffee',
        location: 'Newport Beach, CA',
        sort: 2,
        limit: 20

    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, consumerSecret, accessTokenSecret);
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        success: function (results) {

        	for (i=0, len=results.businesses.length; i<len;i++) {

        		var coffeeCategories = ['coffee'];
        		for (j=0;j<results.businesses[i].categories.length;j++) {
        			coffeeCategories.push(results.businesses[i].categories[j][1]);
        		}
        		
        		var poi = {
        			title: results.businesses[i].name,
        			categories: coffeeCategories,
					poiLat: results.businesses[i].location.coordinate.latitude,
					poiLng: results.businesses[i].location.coordinate.longitude,
					streetAddr: results.businesses[i].location.address[0],
					cityAddr: 'Newport Beach, CA' + results.businesses[i].location.postal_code,
					imgSrc: results.businesses[i].image_url,
					blurb: results.businesses[i].snippet_text,
					index: 6 + i,
					gMarker: {}
        		};


				poiReturned.push(poi);
				pointsOfInterest.push(poi);
        	}

        	yelpResults = results;
        },
    };
    $.ajax(settings)
	.done(function () {
		buildMap();
	})
	.fail(function () {
		alert("Error loading data from Yelp");
	});
};

var hoveredIcon = 'http://mt.google.com/vt/icon?psize=25&font=fonts/Roboto-Bold.ttf&color=ff135C13&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=50&text=%E2%80%A2';
var standardIcon = 'http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1';

var cityLatLng = {lat: 33.659544, lng: -117.860136};

// Creates the map and markers.
function initMap() {

	// New map centered on Newport Beach
	map = new google.maps.Map(document.getElementById('map'), {
		center: cityLatLng,
		zoom: 13
	});

	// General creation of infoWindow
	infowindow = new google.maps.InfoWindow();

	// Call to instantiate the markers
	makeMarkers();
	
}

// This function makes the markers
function makeMarkers() {
	
	for (i=0, len=pointsOfInterest.length; i<len; i++) {

		var latLongPos =  {lat: pointsOfInterest[i].poiLat, lng: pointsOfInterest[i].poiLng};

		var infoContent = '<div style="width:400px;overflow:hidden;">' +
			'<h3 style="">' + pointsOfInterest[i].title +
			'</h3><div style="display:flex;">' +
			'<img src="' + pointsOfInterest[i].imgSrc +
			'"style="max-height:100px;"</img>' +
			'<p style="margin:0;padding-left:10px;word-wrap:break-word;">' + pointsOfInterest[i].blurb +
			'</p></div></div>';

		var marker = new google.maps.Marker( {
			position: latLongPos,
			map: map,
			animation: google.maps.Animation.DROP,
			title: pointsOfInterest[i].title
		});

		bindInfoWindow(marker, map, infowindow, infoContent, i);
	}
}

// function creates an info window.
function bindInfoWindow(marker, map, infowindow, html, i) {
    marker.addListener('click', function() {
        infowindow.setContent(html);
		infoWIndowIndex = pointsOfInterest[i].index;
        infowindow.open(map, this);
    });
	
	marker.addListener('mouseover', function() {
		colorMarker(pointsOfInterest[i].index);
    });
	
	marker.addListener('mouseout', function() {
        unHighlightMarker(pointsOfInterest[i].index);
    });

    // Need this to call trigger events on the marker
    pointsOfInterest[i].gMarker = marker;
}


// function is called when a user clicks on the list view object
function setMapToPoi(poi) {
	map.setCenter( {
		lat : poi.poiLat,
		lng : poi.poiLng
	});
	map.setZoom(17);
	google.maps.event.trigger(poi.gMarker, 'click');
	if (viewport.width < 500) {
		$("#searchMenu").animate({width: 0},500);
		setTimeout(function() {$("#searchMenu").hide();}, 500); 
		$("#toggle").data('name', 'hide');
	}
}

function highlightMarker(poiIndex) {
	// One bounce takes 750 ms
	pointsOfInterest[poiIndex].gMarker.setIcon(hoveredIcon);
	pointsOfInterest[poiIndex].gMarker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function(){ pointsOfInterest[poiIndex].gMarker.setAnimation(null); }, 750);
}

function unHighlightMarker(poiIndex) {
	pointsOfInterest[poiIndex].gMarker.setIcon(standardIcon);
}

function colorMarker(poiIndex) {
	pointsOfInterest[poiIndex].gMarker.setIcon(hoveredIcon);
}


function hideMarker(poi) {
	if (poi.index == infoWIndowIndex) {
		infowindow.close();
	}
	poi.gMarker.setVisible(false);
}

function showMarker(poi) {
	poi.gMarker.setVisible(true);
}

// The viewModel to be initiated with knockout
var ViewModel = function() {

	var self = this;
	
	this.mouseHovered = function(clickedPoi) {
		highlightMarker(clickedPoi.index);
	};
	
    this.mouseGone = function(clickedPoi) {
		unHighlightMarker(clickedPoi.index);
	};

	this.setPoi = function(clickedPoi) {
		setMapToPoi(clickedPoi);
	};

	// Add the initial pois
	this.poiList = ko.observableArray();
	pointsOfInterest.forEach(function(locInfo) {
		self.poiList.push((locInfo));
	});

	// Add the yelpAPI requested pois
	self.poiReturned = ko.observableArray();
	generateContentString(self.poiReturned);
	
	// Updating list dependent on both initial pois AND yelp-requested pois
	this.mediatorList = ko.computed(function() {
		var newList = self.poiList().concat(self.poiReturned());
		return newList.sort(function (left,right) {
			return left.title == right.title ? 0 : (left.title < right.title ? -1 : 1);
		});
	},this);

	this.searchFor = ko.observable('');

	// The final list of elements displayed, filtered by the search
	this.masterList = ko.computed(function() {
		var searchText = this.searchFor().toLowerCase();

		if (!searchText) {
			return this.mediatorList();
		}

		else {
			return ko.utils.arrayFilter(this.mediatorList(), function(Poi) {
				for (i=0, len=Poi.categories.length;i<len;i++) { //
					if ((Poi.title.toLowerCase().indexOf(searchText) >= 0)) { 
						showMarker(Poi);
						return Poi;
					}
					else {
						hideMarker(Poi);
					}
				}
			});
		}
	}, this);
};

ko.applyBindings(new ViewModel());