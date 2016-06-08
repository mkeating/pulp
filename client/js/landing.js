Template.ApplicationLayout.rendered = function() {

	var covers = [	'1bwic.jpg',
					'avon10.jpg',
					'DetectiveBook_pulp_v5n10.jpg',
					'Exciting_Comics_9.jpg',
					'f1eaafca06d032883301ede1a01d7aa2.jpg',
					'Mystery_January_1934.jpg',
					'paperback4.jpg',
					'pulp-masked-rider-1950-1500.jpg',
					'1924-pulp-cover-rm-farley-1950-us-public-domain-publication-datecopyright-not-renewedcommons-wikimedia-org.jpg'];

	var directions = [	'animatedBackgroundRightBottom',
						'animatedBackgroundRightTop',
						'animatedBackgroundLeftBottom',
						'animatedBackgroundLeftTop'];
	
	function animate(i){
		
		setInterval(function(){
		
			var counter = i;
			var direction = Math.floor((Math.random() * directions.length)+ 0);

				$('.animatedBackground').css(
						{
						'position': 'absolute',
						'top': '0',
						'left': '0',
						'width': '100%',
						'height': '100%',
						'z-index': '-50',
						'background-image': 'url(img/pulpcovers/'+covers[counter]+')',
						'background-repeat': 'no-repeat',
						'background-size': '20%',
						'opacity': '.9',

						'animation': directions[direction] + ' 7s linear infinite'
					}
				);

		}, 0 + i * 7000);
			
	}

	function triggerAnim(){
		for(var i = 1; i < covers.length; ++i){
			animate(i);
		}
	}

	$(document).ready(function(){

		$('.animatedBackground').css(
					{
					'position': 'absolute',
					'top': '0',
					'left': '0',
					'width': '100%',
					'height': '100%',
					'z-index': '-50',
					'background-image': 'url(img/pulpcovers/FEATURE_BOOK_pg.3.png)',
					'background-repeat': 'no-repeat',
					'background-size': '20%',
					'opacity': '.9',

					'animation': 'animatedBackgroundRightTop 7s linear 1'
				}
			);
		triggerAnim();
		
	})
	

}