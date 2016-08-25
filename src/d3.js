import d3 from 'd3';


export const run = ({element, width, height}) => {
  const x = d3.scaleTime()
    .domain([new Date(2013, 7, 1), new Date(2013, 7, 15) - 1])
    .rangeRound([0, width]);

  const brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('end', brushended);

  const svg = d3.select(element)
    .attr('width', width)
    .attr('height', height);

  svg.append('g')
    .attr('class', 'axis axis--grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x)
      .ticks(d3.timeHour, 12)
      .tickSize(-height)
      .tickFormat(function () { return null; }))
    .selectAll('.tick')
    .classed('tick--minor', function (d) { return d.getHours(); });

  svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x)
      .ticks(d3.timeDay)
      .tickPadding(0))
    .attr('text-anchor', null)
    .selectAll('text')
    .attr('x', 6);

  svg.append('g')
    .attr('class', 'brush')
    .call(brush);

  function brushended() {
    if (!d3.event.sourceEvent) {
      return;
    } // Only transition after input.
    if (!d3.event.selection) {
      return;
    } // Ignore empty selections.
    const domain0 = d3.event.selection.map(x.invert);
    const domain1 = domain0.map(d3.timeDay.round);

    // If empty when rounded, use floor & ceil instead.
    if (domain1[0] >= domain1[1]) {
      domain1[0] = d3.timeDay.floor(domain0[0]);
      domain1[1] = d3.timeDay.ceil(domain0[1]);
    }

    d3.select(this)
      .transition()
      .call(brush.move, domain1.map(x));
  }


  return {
    onResize(size) {
      console.log(size);
    }
  };
};
