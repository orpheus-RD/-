import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({}),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
  getAllPhotos: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Photo",
      description: "A test photo",
      imageUrl: "https://example.com/photo.jpg",
      imageKey: "photos/test.jpg",
      location: "Test Location",
      camera: "Test Camera",
      lens: "Test Lens",
      settings: "f/2.8, 1/100s, ISO 100",
      tags: "test,photo",
      featured: false,
      published: true,
      sortOrder: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getPhotoById: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Photo",
    description: "A test photo",
    imageUrl: "https://example.com/photo.jpg",
    imageKey: "photos/test.jpg",
    location: "Test Location",
    camera: "Test Camera",
    lens: "Test Lens",
    settings: "f/2.8, 1/100s, ISO 100",
    tags: "test,photo",
    featured: false,
    published: true,
    sortOrder: 0,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  createPhoto: vi.fn().mockResolvedValue({ id: 3 }),
  updatePhoto: vi.fn().mockResolvedValue({ success: true }),
  deletePhoto: vi.fn().mockResolvedValue({ success: true }),
  // Essays
  getAllEssays: vi.fn().mockResolvedValue([]),
  getEssayById: vi.fn(),
  createEssay: vi.fn(),
  updateEssay: vi.fn(),
  deleteEssay: vi.fn(),
  // Papers
  getAllPapers: vi.fn().mockResolvedValue([]),
  getPaperById: vi.fn(),
  createPaper: vi.fn(),
  updatePaper: vi.fn(),
  deletePaper: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("photos.list", () => {
  it("returns photos for public users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.list({});

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("imageUrl");
  });

  it("returns photos with filter options", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.list({ featured: true, limit: 5 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("photos.get", () => {
  it("returns a single photo by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.get({ id: 1 });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id", 1);
    expect(result).toHaveProperty("title");
  });
});

describe("photos.create", () => {
  it("creates a photo for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.create({
      title: "New Photo",
      imageUrl: "https://example.com/new.jpg",
      imageKey: "photos/new.jpg",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
  });

  it("throws error for non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.photos.create({
        title: "New Photo",
        imageUrl: "https://example.com/new.jpg",
        imageKey: "photos/new.jpg",
      })
    ).rejects.toThrow();
  });

  it("throws error for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.photos.create({
        title: "New Photo",
        imageUrl: "https://example.com/new.jpg",
        imageKey: "photos/new.jpg",
      })
    ).rejects.toThrow();
  });
});

describe("photos.update", () => {
  it("updates a photo for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.update({
      id: 1,
      title: "Updated Photo",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success", true);
  });

  it("throws error for non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.photos.update({
        id: 1,
        title: "Updated Photo",
      })
    ).rejects.toThrow();
  });
});

describe("photos.delete", () => {
  it("deletes a photo for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.photos.delete({ id: 1 });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success", true);
  });

  it("throws error for non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.photos.delete({ id: 1 })).rejects.toThrow();
  });

  it("throws error for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.photos.delete({ id: 1 })).rejects.toThrow();
  });
});
