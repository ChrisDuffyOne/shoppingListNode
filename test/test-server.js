var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function(){
	it('should list items on GET',function(done){
		chai.request(app)
			.get('/items')
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(200);
				response.should.be.json;
				storage.id.should.equal(3);
				response.body.should.be.a('array');
				response.body.should.have.length(3);
				response.body[0].should.be.a('object');
				response.body[0].should.have.property('id');
				response.body[0].should.have.property('name');
				response.body[0].id.should.be.a('number');
				response.body[0].name.should.be.a('string');
				response.body[0].name.should.equal('Broad beans');
				response.body[1].name.should.equal('Tomatoes');
				response.body[2].name.should.equal('Peppers');
				done();
			});
	});

	it('should add an item on POST', function(done){
		chai.request(app)
			.post('/items')
			.send({'name': 'Kale'})
			.end(function(error, response){
				should.equal(error,null);
				response.should.have.status(201);
				response.should.be.json;
				response.body.should.be.a('object');
				response.body.should.have.property('name');
				response.body.should.have.property('id');
				response.body.name.should.be.a('string');
				response.body.id.should.be.a('number');
				response.body.id.should.equal(3); //DEBUG
				response.body.name.should.equal('Kale');
				storage.items.should.be.a('array');
				storage.items.should.have.length(4);
				storage.items[3].should.be.a('object');
				storage.items[3].should.have.property('id');
				storage.items[3].should.have.property('name');
				storage.items[3].id.should.be.a('number');
				storage.items[3].name.should.be.a('string');
				storage.items[3].name.should.equal('Kale');
				done();
			});
	});

	it('should edit items on PUT',function(done){
		chai.request(app)
			.put('/items/1')
			.send({'name': 'Bacon','id':'1'})
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(200);
				response.should.be.json;
				response.body.should.be.a('object');
				response.body.should.have.property('name');
				response.body.should.have.property('id');
				response.body.name.should.be.a('string');
				response.body.id.should.be.a('number');
				response.body.id.should.equal(1);
				response.body.name.should.equal('Bacon');
				storage.items[1].should.be.a('object');
				storage.items[1].should.have.property('id');
				storage.items[1].should.have.property('name');
				storage.items[1].id.should.be.a('number');
				storage.items[1].name.should.be.a('string');
				storage.items[1].id.should.equal(1);
				storage.items[1].name.should.equal('Bacon');
				done();
			});
	});

	it('should delete an item on DELETE',function(done){
		chai.request(app)
			.delete('/items/1')
			.send({'name': 'Bacon','id':'1'})
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(200);
				response.should.be.json;
				
				//Correct Deleted Item Returned
				response.body.should.be.a('object');
				response.body.should.have.property('name');
				response.body.should.have.property('id');
				response.body.name.should.be.a('string');
				response.body.id.should.be.a('number');
				response.body.id.should.equal(1);
				response.body.name.should.equal('Bacon');

				//Check to make sure that storage.items array has been renumerated
				storage.id.should.equal(3);
				storage.items[2].should.be.a('object');
				storage.items[2].should.have.property('id');
				storage.items[2].should.have.property('name');
				storage.items[2].id.should.be.a('number');
				storage.items[2].id.should.equal(2);
				storage.items[2].name.should.be.a('string');
				storage.items[2].name.should.equal('Kale');
				done();
			});
	});

	it('should add items on PUT edge case',function(done){
		chai.request(app)
			.put('/items/10')
			.send({'name': 'Chicken','id':'10'})
			.end(function(error, response){
				should.equal(error, null);
				response.should.have.status(201);
				response.should.be.json;
				response.body.should.be.a('object');
				response.body.should.have.property('name');
				response.body.should.have.property('id');
				response.body.name.should.be.a('string');
				response.body.id.should.be.a('number');
				response.body.id.should.equal(3);
				storage.id.should.equal(4);
				response.body.name.should.equal('Chicken');
				done();
			});
	});

});