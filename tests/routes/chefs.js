var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Chefs Route (Version 1)', () => {
  it('should list ALL chefs on /chefs GET', (done) => {
    chai.request(server)
      .get('/chefs')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Chefs ');
        done();
      });
  });
  it('should list a SINGLE chef on /chefs/:chef GET', (done) => {
    chai.request(server)
      .get('/chefs/blah')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.html;
        expect(res.text).to.include(' Chef: ');
        done();
      });
  });
});
