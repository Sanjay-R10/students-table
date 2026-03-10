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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-semibold text-lg">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">🎓 Students Table</h1>
          <p className="text-gray-500 mt-1">Manage your student records easily</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-indigo-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
          />
          <button
            onClick={handleDownload}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition"
          >
            ⬇ Download Excel
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setFormData(emptyForm); setErrors({}); setEditId(null); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition"
          >
            {showForm ? "✕ Cancel" : "+ Add Student"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-indigo-100 rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-4">
              {editId ? "✏️ Edit Student" : "➕ Add New Student"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>
            <button
              onClick={editId ? handleUpdateSubmit : handleAddSubmit}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
            >
              {editId ? "Update Student" : "Add Student"}
            </button>
          </div>
        )}

        {/* Student count */}
        <p className="text-sm text-gray-500 mb-3">
          Showing <span className="font-semibold text-indigo-600">{filteredStudents.length}</span> of <span className="font-semibold text-indigo-600">{students.length}</span> students
        </p>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-indigo-600 text-white text-sm uppercase tracking-wider">
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Age</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{student.name}</td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {student.age} yrs
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(student.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Dialog */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Delete Student</h3>
                <p className="text-gray-500 text-sm mt-1">Are you sure? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;