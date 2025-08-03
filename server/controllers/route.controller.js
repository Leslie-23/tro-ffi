import Route from "../models/Routes.model.js";

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.getAll();
    res.json({ count: routes.length, routes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const route = await Route.getById(req.params.id);
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createRoute = async (req, res) => {
  try {
    const newRoute = await Route.create(req.body);
    res.status(201).json({ message: "Route created", route: newRoute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const updated = await Route.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Update failed" });
    res.json({ message: "Route updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const deleted = await Route.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Delete failed" });
    res.json({ message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
