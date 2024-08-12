import request from 'supertest';
import { app } from '../../app';
import CourseModel from '../../models/course.model';

describe("COURSE CONTROLLER TEST", ()=>{
  it('has a route handler listening to /auth/signup', async () => {
    const response = await request(app).post('/auth/signup');
    expect(response.status).not.toEqual(404);
  });
  it('can only be accessed if signed in', async () => {
    await request(app).get('/api/courses').send({}).expect(401);
  });
  
  it('returns a list of courses if signed in', async () => {
    await CourseModel.create({
      name: 'Test Course',
      description: 'Test Course Description',
      teacherId: 'testTeacherId',
    });
    // const cookie = await signin();
    const response = await request(app)
      .get('/api/courses')
      // .set('Cookie', cookie)
      .send({});
    expect(response.body.length).toBeGreaterThan(0);
  });  
})



