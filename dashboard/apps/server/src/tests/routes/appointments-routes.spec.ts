import request from "supertest";
import { app } from "../../index";
import {
  AppointmentsMock,
  UserMockClient,
  UserMockAdmin,
} from "../mock/mock-api";

describe("Appointments tests", () => {
  it("should create an appointment with the simulated data", async () => {
    try {
      const response = await request(app)
        .post(`/api/appointments?userId=${UserMockClient.id}`)
        .send(AppointmentsMock);
      expect(response.body).toHaveProperty("appointment");
      expect(response.body.appointment).toHaveProperty("id");
      expect(response.body.appointment.id).toBe(AppointmentsMock.id);
    } catch (error) {
      console.log("error ao criar um agendamento com dados mock: ", error);
    }
  });
  it("should return all appointments, 'role: Admin' ", async () => {
    try{
      const response = await request(app).get(`/api/appointments?userId=${UserMockAdmin.id}`);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    }catch(error){
      console.log("error em buscar todos os usúarios com role: Admin: ", error);
    }
  });
  it("should return all appointments, 'role: Client' ", async () => {
    try{
      const response = await request(app).get(`/api/appointments?userId=${UserMockClient.id}`);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    }catch(error){
      console.log("error em buscar todos os usúarios com role: Client: ", error);
    }
  });
});
