/*
Copyright (c) <2014> - Scoccimarro Maximiliano

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($) {

	var defaults = {
		// General
		color: '',
		gradient: false,
		gradientColors: [],
		easing: 'swing',
		speed: 600,
		width: 0,
		height: 0,
		fillWidth: 0,
		days: true,
		hours: true,
		minutes: true,
		seconds: true,
		targetDate: false,

		// Callbacks
		onStep: function() {}
	};

	$.fn.xmcountdown = function(options) {

		if(this.length == 0) return this;

		// namespace, reference and global
		var cd = {},
			countdown = this;

		/**
		 * Initializes and validates namespace settings
		 */
		var init = function() {
			// merge settings
			cd.settings = $.extend({}, defaults, options);
			countdown.addClass('xmcountdown');

			// draw canvas elements
			draw();
			// start countdown
			startTimer();
		};

		/**
		 * Draws canvas elements
		 */
		var draw = function() {
			if(cd.settings.days) {
				var days = (createCanvas('days'));
				createContent(days);
				countdown.append(days);
			}
			if(cd.settings.hours) {
				var hours = createCanvas('hours');
				createContent(hours);
				countdown.append(hours);
			}
			if(cd.settings.minutes) {
				var minutes = createCanvas('minutes');
				createContent(minutes);
				countdown.append(minutes);
			}
			if(cd.settings.seconds) {
				var seconds = createCanvas('seconds');
				createContent(seconds);
				countdown.append(seconds);
			}			
		}

		/**
		 * Creates canvas elements
		 */
		var createCanvas = function(className) {
			var container = document.createElement('div'),
				canvas = document.createElement('canvas');
				
			// set container properties
			container.className = className;
			container.style.float = 'left';

			// set canvas properties
			canvas.width = cd.settings.width;
			canvas.height = cd.settings.height;
			
			// render canvas
			render(canvas, 100);
			container.appendChild(canvas);
			return container;
		};

		/**
		 * Render canvas element
		 */
		 var render = function(canvas, perc) {
		 	var ctx = canvas.getContext('2d'),
		 		x = cd.settings.width,
				y = cd.settings.height,
				radius = (cd.settings.width - (cd.settings.fillWidth * 2)) / 2,
				lineWidth = cd.settings.fillWidth,
				quart = Math.PI / 2,
				circ = Math.PI * 2;

			// clear canvas
			ctx.clearRect(0, 0, x, y);

			// draw circle
			ctx.beginPath();
			ctx.arc(x/2, y/2, radius, -quart, -(circ * perc/100) - quart);
			ctx.lineWidth = lineWidth;

			if(cd.settings.gradient) {
				// if using gradient
				var gradient = ctx.createLinearGradient(0, y/2, x, 0),
					colors = cd.settings.gradientColors;

				gradient.addColorStop(0, colors[0]);
				gradient.addColorStop(1, colors[1]);
				ctx.strokeStyle = gradient;
			} else ctx.strokeStyle = cd.settings.color;

			ctx.stroke();
		 };

		/**
		 * Creates container content
		 */
		var createContent = function(container) {
			var $container = $(container),
				$content = $('<p>'),
				$value = $('<span>', {'class': 'value'}),
				$tag = $('<span>', {'class': 'tag'});

			$content.width(cd.settings.width);
			// content positioning
			$content.css('marginLeft', -($content.width() / 2));	

			$tag.text($container.attr('class'));
			$content.append($value);
			$content.append('<br>');
			$content.append($tag);
			$container.append($content);
		};

		/**
		 * Starts countdown
		 */
		var startTimer = function() {
			timer();
			// update timer each second
			setInterval(function() {
				timer();
			}, 1000);	
		};

		/**
		 * Sets countdown actual values
		 */
		var timer = function() {
			var currentDate, days, hours,
				minutes, seconds, prevSeconds, secondsLeft;

			currentDate = new Date().getTime(),
			secondsLeft = (cd.settings.targetDate.getTime() - currentDate) / 1000;

			days = parseInt(secondsLeft / 86400);
			secondsLeft = secondsLeft % 86400;
			 
			hours = parseInt(secondsLeft / 3600);
			secondsLeft = secondsLeft % 3600;
			  
			minutes = parseInt(secondsLeft / 60);
			seconds = parseInt(secondsLeft % 60);

			// render canvas
			render(countdown.find('.seconds > canvas')[0], (seconds*100)/60);
			render(countdown.find('.minutes > canvas')[0], (minutes*100)/60);
			render(countdown.find('.hours > canvas')[0], (hours*100)/24);
			render(countdown.find('.days > canvas')[0], (days*100)/365);

			if(days < 10) days = '0' + days;
			if(hours < 10) hours = '0' + hours;
			if(minutes < 10) minutes = '0' + minutes;
			if(seconds < 10) seconds = '0' + seconds;

			// update values
			countdown.find('.days span.value').text(days);
			countdown.find('.hours span.value').text(hours);
			countdown.find('.minutes span.value').text(minutes);
			countdown.find('.seconds span.value').text(seconds);
		};

		init();
		return this;
	};
}(jQuery));