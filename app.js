var Map = (function(win,doc,undefined){
	var width = d3.select('header').node().getBoundingClientRect().width
				- d3.select('#control').node().getBoundingClientRect().width
				- d3.select('#right-content').node().getBoundingClientRect().width,
			height = window.innerHeight - document.querySelector('header').clientHeight,
			listHeight = height - d3.select('#control').node().getBoundingClientRect().height + 4;
	
	var mapCategories = d3.selectAll('.category'),
			map = d3.select('#map').append('svg')
					.attr('width',width)
					.attr('height',height);

	var projection = d3.geo.mercator()
			.scale((1 << 15) / 2 / Math.PI)
			.translate([width / 2, height / 2])
			.center([-82.79, 40.29]);
			
	var path = d3.geo.path()
			.projection(projection)

	function buildMap(e,d){	
		map.selectAll('.marker')
				.data(d.features)
			.enter().append('path')
				.attr('d', function(s){
					if(s.geometry.type == 'Polygon') return path(s);
					return 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z';})
				.attr('transform',function(d){
					if(d.geometry.type == 'Polygon') return;
					var coord = projection(d.geometry.coordinates);
					coord = [coord[0]-8,coord[1]-25]
					d.properties.transform = coord;
					d.properties.transformUp = [coord[0],coord[1]-10];
					return "translate(" + coord + ")";
				})
				.attr('class',function(d){ return (d.properties.type)?'marker ' + d.properties.type:'ohio'; });
	}
	d3.json('state.json',buildMap);
			
	function selectCategory(){
		d3.selectAll('.marker')
			.transition()
				.style('opacity',0);
		d3.selectAll('.marker.' + this.dataset.type)
				.attr('transform', function(d){ return 'translate( ' + d.properties.transformUp + ')'; })
			.transition().delay(function(d,i){return 200 * i;})
				.style('opacity',1)
				.attr('transform', function(d){ return 'translate( ' + d.properties.transform + ')'; });;
		mapCategories.select('.item-list').style('max-height','0em');
		d3.select(this).select('.item-list').transition().duration(1000).style('max-height', listHeight + 'px');
		d3.selectAll('.map-category-info').transition()
				.style('opacity',0);
		d3.select('.map-category-info.' + this.dataset.type)
				.style({'opacity':1,'max-height':0})
			.transition().duration(1000)
				.style('max-height','10em');
	}
	mapCategories.on('click',selectCategory);
})(window,document);