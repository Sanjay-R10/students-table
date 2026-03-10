import React from 'react';
import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';

const initialStudents = [
  { id: 1, name: "Sanjay kumar", email: "sanjay@gmail.com", age: 24 },
  { id: 2, name: "Priya Sharma", email: "priya@gmail.com", age: 22 },
  { id: 3, name: "Ravi Menon", email: "ravi@gmail.com", age: 21 },
  { id: 4, name: "Sneha Patel", email: "sneha@gmail.com", age: 23 },
];

const emptyForm = { name: "", email: "", age: "" };

function validate(formData) {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email";
  }
  if (!formData.age) {
    errors.age = "Age is required";
  } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 100) {
    errors.age = "Enter a valid age (1-100)";
  }
  return errors;
}

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setStudents(initialStudents);
      setLoading(false);
    }, 1500);
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleAddSubmit() {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const newStudent = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
    };
    setStudents([...students, newStudent]);
    setFormData(emptyForm);
    setErrors({});
    setShowForm(false);
  }

  function handleEdit(student) {
    setEditId(student.id);
    setFormData({ name: student.name, email: student.email, age: student.age });
    setErrors({});
    setShowForm(true);
  }

  function handleUpdateSubmit() {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStudents(students.map((s) =>
      s.id === editId
        ? { ...s, name: formData.name, email: formData.email, age: Number(formData.age) }
        : s
    ));
    setFormData(emptyForm);
    setErrors({});
    setEditId(null);
    setShowForm(false);
  }

  function handleDelete(id) {
    setStudents(students.filter((s) => s.id !== id));
    setDeleteId(null);
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleDownload() {
    const dataToExport = filteredStudents.map((s, index) => ({
      "#": index + 1,
      Name: s.name,
      Email: s.email,
      Age: s.age,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading students...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students Table</h1>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ⬇ Download Excel
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setFormData(emptyForm); setErrors({}); setEditId(null); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Student"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Add/Edit Student Form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {editId ? "Edit Student" : "Add New Student"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                type="number"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
            <button
              onClick={editId ? handleUpdateSubmit : handleAddSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {editId ? "Update Student" : "Add Student"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Age</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.age}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(student.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Student</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;