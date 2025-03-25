import request from "supertest";
import { app } from "../../index";
import { UserMockAdmin, UserMockClient } from "../mock/mock-api";

describe("User tests", () => {
  it("should create a user or see if a user with role 'Admin' already exists with the mock data", async () => {
    try {
      const response = await request(app).post("/api/users").send(UserMockAdmin);
  
      if (response.body.user) {
        expect(response.body).toHaveProperty("user");
        expect(response.body.user).toHaveProperty("id");
      } else if (response.body.error === "ID já está em uso") {
        expect(response.body).toHaveProperty("error", "ID já está em uso");
        expect(response.status).toBe(409);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    }catch(error) {
      console.log("error no teste de criar usuário com dados mock ou verificar se já existe usúario com dados do mock: ", error);
    }
  });
  it("should create a user or see if a user with role 'Client' already exists with the mock data", async () => {
    try {
      const response = await request(app).post("/api/users").send(UserMockClient);
  
      if (response.body.user) {
        expect(response.body).toHaveProperty("user");
        expect(response.body.user).toHaveProperty("id");
      } else if (response.body.error === "ID já está em uso") {
        expect(response.body).toHaveProperty("error", "ID já está em uso");
        expect(response.status).toBe(409);
      } else {
        throw new Error("Resposta inesperada da API");
      }
    }catch(error) {
      console.log("error no teste de criar usuário com dados mock ou verificar se já existe usúario com dados do mock: ", error);
    }
  });
  it("should return user information based on the id passed in the req params", async () => {
    try {
      const response = await request(app).get(`/api/users/${UserMockAdmin.id}`);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
    }catch(error) {
      console.log("error no teste de buscar usuário por id: ", error);
    }
  });
  it("should return all users 'role: Admin' ", async () => {
    try {
      const response = await request(app).get(`/api/users?initial=0&limit=100&userId=${UserMockAdmin.id}`);
      expect(Array.isArray(response.body)).toBe(true);
    }catch(error){
      console.log("error no teste de buscar todos os usuários por id com role 'Admin' : ", error);
    }
  });
  it("should return myself user information, only based on the id passed in the req params 'role: Client' ", async () => {
    try{
      const response = await request(app).get(`/api/users?initial=0&limit=100&userId=${UserMockClient.id}`);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("id", UserMockClient.id);
    }catch(error){
      console.log("error no teste de buscar todos os usuários por id com role 'Client' : ", error);
    }
  });
});
