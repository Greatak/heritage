var Map = (function(win,doc,undefined){
	var width = document.body.clientWidth * 0.67,
			height = window.screen.height;

	var mapCategories = d3.selectAll('.category'),
			map = d3.select('#map-container').append('svg')
					.attr('width',width)
					.attr('height',height);

	var projection = d3.geo.mercator()
			.scale((1 << 15) / 2 / Math.PI)
			.translate([width / 2, height / 2])
			.center([-83.0028, 39.9620]);
			
	var path = d3.geo.path()
			.projection(projection)

	function buildMap(e,d){	
		map.selectAll('.marker')
				.data(d.features)
			.enter().append('path')
				.attr('d',path)
				.attr('class',function(d){ return (d.properties.type)?'marker ' + d.properties.type:'ohio'; });
	}
	d3.json('state.json',buildMap);
			
	function selectCategory(){
		d3.selectAll('.marker').transition().style('opacity',0);
		d3.selectAll('.' + this.dataset.type)
			.transition().delay(function(d,i){return 200 * i;})
			.style('opacity',1);
		mapCategories.select('.item-list').style('max-height','0em');
		d3.select(this).select('.item-list').transition().style('max-height','10em');
	}
	mapCategories.on('click',selectCategory);
})(window,document);