

const mongoose = require('mongoose');
const Poll = mongoose.model('Poll');
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;



exports.showAllPolls  = async (req,res) => {
    
    const pollList =    await Poll.find({});
    // FIXME: have res.render have pollList data showing properly
    console.log(pollList);
    const link = req.headers.host;

    res.render('pollsAll', {link, pollList});


    /*
     TODO:
        find random assortment of polls
        load a limit of polls on the page
    */ 
};
exports.poll = (req,res) => {
    console.log();

    res.render('poll');
};
//post
exports.savePoll = async (req, res) => {

    const poll = new Poll(req.body);

    console.log(poll);

    await poll.save();



    req.flash('success', 'new poll has been created!');
    //vote view
    //my polls
    console.log(poll._id);
    res.redirect(`/poll/${poll._id}/link`);
}
exports.showLink = (req, res) => {

    const params = req.params.id
    const headers = req.headers.host

    console.log(headers)
    res.render('link', {
        params,
        headers
    })
}
exports.showVote = async (req, res) => {
    //find votedata based on id params
    const vote = await Poll.findOne({
        _id: req.params.id
    })

    console.log(vote)

    //diplay view of options to form
    res.render('vote', {
        vote
    });
}
exports.voteData = async (req, res) => {

    const vote = await Poll.findOne({
        _id: req.params.id
    })

    vote.choice.push(req.body.choice);

    await vote.save()

    console.log(vote)

    res.redirect(`/poll/${vote._id}/graph`)


}
exports.graph = async (req, res, next) => {

    let parameter = req.params.id;

    console.log(parameter)



    const votes = await Poll.getPollNumbers(parameter)

    req.votes = votes

    next()
    // res.render('graph', {votes});
};
exports.barGraph = (req, res) => {

    //voting data from exports.graph 
    const votes = req.votes

    console.log(votes)

    //d3 package
    const d3 = req.app.d3

    //dom elements variables -build w/ jsdom
    const dom = new JSDOM('<!doctype html><html></html>')
    const document = dom.window.document;
    //svg dimensions



    let margin = {
        top: 10,
        right: 10,
        bottom: 90,
        left: 20
    };
    // Setting the margins, sizes, and figuring out the basic scale.
    let width = 960 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;
    // Setting the margins, sizes, and figuring out the basic scale.

    // Setting the axes
    // length
    let xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)
    let yScale = d3.scale.linear().range([height, 0]);

    //set x axis to be bottom
    let xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");


    let yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // Setting the axes

    // Drawing the basic SVG container with the proper size and margins


    const layout = d3.select(document.body)
                     .append("svg");


    layout.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // size of x and y axis based on data
    xScale.domain(votes.map(function (d) {
        return d._id;
    }));
    yScale.domain([0, d3.max(votes, function (d) {
        return d.count;
    })]);
    // size of x and y axis based on data


    //FIXME:   allows responsive graph with removal  

    //   layout
    //      .attr('viewbox','0 0 300 300')
    //      .attr("preserveAspectRatio", 'xMidYMid meet')
    //      .attr('class','svg-content')
    //      .classed("svg-content", true);
    //bar placement on gr
    layout.selectAll(".bar")
        .data(votes)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d._id);
        })
        .attr("width", xScale.rangeBand())
        .attr("y", function (d) {
            return yScale(d.count);
        })
        .attr("height", function (d) {
            return height - yScale(d.count);
        });



    layout.selectAll(".text")
        .data(votes)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (function (d) {
            return xScale(d._id)+xScale.rangeBand() / 2;// position of count x axi
        }))
        .attr("y", function (d) {
            return yScale(d.count) + 1;
        }) //position of count y axis (high number pushes cound lower)
        .attr("dy", ".75em")
        .text(function (d) {
            return d.count +" votes";
        });// value of count in bar

//label
    layout.selectAll(".text")
        .data(votes)
        .enter()
        .append("text")
        .attr("class", "label label__id")
        .attr("x", (function (d) {
            return xScale(d._id) + xScale.rangeBand() / 2;
        })) // position of label x axi
        .attr('y',function(d){
            return yScale(0) // up or down a integer 
        })  //height of label
        .attr("dy", "1.75em")
        .text(function (d) {
            console.log(d._id)
            return d._id;
        }); // value of label



    //adding responsivness



    //activate in template using !{barGraph}
    res.render('graph', {
        barGraph: layout.node().outerHTML
    })
}