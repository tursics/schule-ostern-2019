/* tursics.de/story/ - JavaScript file */

/*jslint browser: true*/
/*global $,L,window,document,ddj*/

var layerPopup = null;

/*var settings = {
};*/

// -----------------------------------------------------------------------------

function mapAction() {
	'use strict';
}

// -----------------------------------------------------------------------------

function formatNumber(txt) {
	'use strict';

	txt = String(parseInt(txt, 10));
	var sign = '',
		pos = 0;
	if (txt[0] === '-') {
		sign = '-';
		txt = txt.slice(1);
	}

	pos = txt.length;
	while (pos > 3) {
		pos -= 3;
		txt = txt.slice(0, pos) + '.' + txt.slice(pos);
	}

	return sign + txt;
}

// -----------------------------------------------------------------------------

function enrichMissingData(data) {
	'use strict';

	try {
		$.each(data, function (key, val) {
			val.Building = false;

			val.Akustik = val.Akustik === 'X';
			val.Amok = val.Amok === 'X';
			val.AulaMensa = val.AulaMensa === 'X';
			val.Barrierefreiheit = val.Barrierefreiheit === 'X';
			val.Building = val.Building || (val.Boden === 'X');
			delete val.Boden;
			val.Brandschutz = val.Brandschutz === 'X';
			val.Building = val.Building || (val.Dach === 'X');
			delete val.Dach;
			val.Elektro = val.Elektro === 'X';
			val.Building = val.Building || (val.Fassade === 'X');
			delete val.Fassade;
			val.Building = val.Building || (val.Fenster === 'X');
			delete val.Fenster;
			val.Gesundheit = val.Gesundheit === 'X';
			val.Heizung = val.Heizung === 'X';
			val.Building = val.Building || (val.Komplett === 'X');
			delete val.Komplett;
			val.Maler = val.Maler === 'X';
			val.Raum = val.Raum === 'X';
			val.Sanitaer = val['Sanitär'] === 'X';
			delete val['Sanitär'];
			val.Schliessanlage = val.Schliessanlage === 'X';
			val.Sonstiges = val.Sonstiges === 'X';
			val.Sport = val.Sport === 'X';
		});
	} catch (e) {
//		console.log(e);
	}

	return data;
}

// -----------------------------------------------------------------------------

function getColor(data) {
	'use strict';

	return 'blue';
}

// -----------------------------------------------------------------------------

function getIconSet(data) {
	'use strict';

	var str = '';
	if (data.Building) {
		str += '<i class="fa fa-fw fa-home" aria-hidden="true"></i>';
	}
	if (data.Brandschutz) {
		str += '<i class="fa fa-fw fa-fire-extinguisher" aria-hidden="true"></i>';
	}
	if (data.Sanitaer) {
		str += '<i class="fa fa-fw fa-tint" aria-hidden="true"></i>';
	}
	if (data.Barrierefreiheit) {
		str += '<i class="fa fa-fw fa-wheelchair" aria-hidden="true"></i>';
	}
	if (data.AulaMensa) {
		str += '<i class="fa fa-fw fa-cutlery" aria-hidden="true"></i>';
	}

	if (data.Raum) {
		str += '<i class="fa fa-fw fa-flask" aria-hidden="true"></i>';
	}
	if (data.Elektro) {
		str += '<i class="fa fa-fw fa-lightbulb-o" aria-hidden="true"></i>';
	}
	if (data.Akustik) {
		str += '<i class="fa fa-fw fa-volume-up" aria-hidden="true"></i>';
	}
	if (data.Heizung) {
		str += '<i class="fa fa-fw fa-shield" aria-hidden="true"></i>';
	}
	if (data.Maler) {
		str += '<i class="fa fa-fw fa-paint-brush" aria-hidden="true"></i>';
	}

	if (data.Sport) {
		str += '<i class="fa fa-fw fa-soccer-ball-o" aria-hidden="true"></i>';
	}
	if (data.Amok) {
		str += '<i class="fa fa-fw fa-bell" aria-hidden="true"></i>';
	}
	if (data.Gesundheit) {
		str += '<i class="fa fa-fw fa-medkit" aria-hidden="true"></i>';
	}
	if (data.Schliessanlage) {
		str += '<i class="fa fa-fw fa-key" aria-hidden="true"></i>';
	}
	if (data.Sonstiges) {
		str += '<i class="fa fa-fw fa-ellipsis-h" aria-hidden="true"></i>';
	}

	return str;
}

// -----------------------------------------------------------------------------

function updateMapSelectItem(data) {
	'use strict';

	mapAction();

	var options = {
		closeButton: false,
		offset: L.point(0, 0),
		className: 'printerLabel'
	},
		coordinates = [data.lat, data.lng],
		str = '',
		value = '';

	value = formatNumber(data.KostenInEuroBrutto || '0');

	str += '<div style="padding-bottom:.5em;">' + data.Schulname + '</div>';
	str += '<div>' + data['Schulbaumaßnahme'] + '</div>';
	str += '<div>für ' + value + ' Euro</div>';
	str += '<div class="iconsetmarker" style="margin-top:.2em;"><div style="margin:0 -.15em -.2em -.15em;text-align:left;width:auto;border-radius:0;">' + getIconSet(data) + '</div></div>';

	layerPopup = L.popup(options)
		.setLatLng(coordinates)
		.setContent(str)
		.openOn(ddj.getMap());
}

// -----------------------------------------------------------------------------

function selectSuggestion(selection) {
	'use strict';

	$.each(ddj.getData(), function (key, val) {
		if (val && (val.BSN === selection)) {
			ddj.getMap().panTo(new L.LatLng(val.lat, val.lng));
			updateMapSelectItem(val);
		}
	});
}

// -----------------------------------------------------------------------------
/*
function initSocialMedia() {
	'use strict';

	setTimeout(function () {
		$.ajax('http://www.tursics.de/v5shariff.php?url=http://schulsanierung.tursics.de/')
			.done(function (json) {
				$('.social .facebook span').html(json.facebook);
				if (json.facebook > 0) {
					$('.social .facebook span').addClass('active');
				}

				$('.social .twitter span').html(json.twitter);
				if (json.twitter > 0) {
					$('.social .twitter span').addClass('active');
				}
			});
	}, 1000);
}
*/
// -----------------------------------------------------------------------------

var ControlInfo = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	onAdd: function () {
		'use strict';

		var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

		container.innerHTML = '<a style="font-size:1.2em" href="#popupShare" title="Teilen" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-share-alt" aria-hidden="true"></i></a>';
		container.innerHTML += '<a style="font-size:1.2em" href="#popupInfo" title="Info" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-info" aria-hidden="true"></i></a>';
		container.innerHTML += '<a style="font-size:1.2em" href="#popupAuthor" title="Autor" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-envelope" aria-hidden="true"></i></a>';

		return container;
	}
});

// -----------------------------------------------------------------------------

$(document).on("pageshow", "#pageMap", function () {
	'use strict';

	function updateEmbedURI() {
		var size = $('#selectEmbedSize').val().split('x'),
			x = size[0],
			y = size[1],
			html = '<iframe src="https://tursics.github.io/schule-quereinsteiger/" width="' + x + '" height="' + y + '" frameborder="0" style="border:0" allowfullscreen></iframe>';

		$('#inputEmbedURI').val(html);
		if (-1 === $('#embedMap iframe')[0].outerHTML.indexOf('width="' + x + '"')) {
			$('#embedMap iframe')[0].outerHTML = html.replace('.html"', '.html?foo=' + (new Date().getTime()) + '"');
			$('#embedMap input').focus().select();
		}
	}

	// center the city hall
	ddj.map.init('mapContainer', {
		mapboxId: 'tursics.l7ad5ee8',
		mapboxToken: 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiI1UWlEY3RNIn0.U9sg8F_23xWXLn4QdfZeqg',
		centerLat: 52.518413,
		centerLng: 13.408368,
		zoom: 13,
		onFocusOnce: mapAction
	});

	var dataUrl = 'data/schulbaumassnahme_in_den_osterferien.json';
	$.getJSON(dataUrl, function (data) {
		data = enrichMissingData(data);

		ddj.init(data);

		ddj.marker.init({
			onAdd: function () {
				return false;
			},
			onAddHTML: function (marker, value) {
				marker.htmlClass = 'iconsetmarker';
				marker.htmlElement = '<span class="arrow"></span><div>' + getIconSet(value) + '</div>';

				return true;
			},
			onClick: function (latlng, data) {
				updateMapSelectItem(data);
			}
		});

		ddj.search.init({
			showNoSuggestion: true,
			titleNoSuggestion: '<i class="fa fa-info-circle" aria-hidden="true"></i> Geben sie bitte den Namen einer Schule ein',
			onAdd: function (obj, value) {
				var name = value.Schulname,
//					color = getColor(value),
					color = 'blue';

				if ('' !== value.BSN) {
					name += ' (' + value.BSN + ')';
				}

				obj.sortValue1 = name;
				obj.sortValue2 = value.BSN;
				obj.data = value.BSN;
				obj.color = color;
				obj.value = name;
				obj.desc = value.Schulart;

				return true;
			},
			onFocus: function () {
				mapAction();

				window.scrollTo(0, 0);
				document.body.scrollTop = 0;
				$('#pageMap').animate({
					scrollTop: parseInt(0, 10)
				}, 500);
			},
			onFormat: function (suggestion, currentValue) {
				var color = suggestion.color,
					icon = 'fa-building-o',
					str = '';

				str += '<div class="autocomplete-icon back' + color + '"><i class="fa ' + icon + '" aria-hidden="true"></i></div>';
				str += '<div>' + suggestion.value.replace(new RegExp(currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<strong>' + currentValue + '</strong>') + '</div>';
				str += '<div class="' + color + '">' + suggestion.desc + '</div>';
				return str;
			},
			onClick: function (data) {
				selectSuggestion(data.BSN);
			}
		});

//		initSocialMedia();
	});

	ddj.getMap().addControl(new ControlInfo());

	$('#autocomplete').val('');
	$('#receipt .group').on('click', function () {
		$(this).toggleClass('groupClosed');
	});
	$('.legend').on('click', function () {
		$('.legend').toggleClass('opened');
	});
	$('#searchBox .sample a:nth-child(1)').on('click', function () {
		$('#autocomplete').val('Neumark-Grundschule (07G13)');
		selectSuggestion('07G13');
	});

	$("#popupShare").on('popupafteropen', function () {
		$('#shareLink input').focus().select();
	});
	$('#tabShareLink').on('click', function () {
		$('#popupShare').popup('reposition', 'positionTo: window');
		$('#shareLink input').focus().select();
	});
	$('#tabEmbedMap').on('click', function () {
		updateEmbedURI();
		$('#popupShare').popup('reposition', 'positionTo: window');
		$('#embedMap input').focus().select();
	});

	$('#selectEmbedSize').val('400x300').selectmenu('refresh');
	$('#selectEmbedSize').on('change', function () {
		updateEmbedURI();
		$('#popupShare').popup('reposition', 'positionTo: window');
	});
});

// -----------------------------------------------------------------------------
