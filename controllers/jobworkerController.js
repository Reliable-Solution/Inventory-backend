const jobWorkers = require('../model/jobworker')
const express = require('express');
const JobWorker = require('../model/jobworker');

const router = express.Router();

/**
 * 🚀 Create a new Job Worker
 * POST /jobworkers
 */
exports.createJobWorker = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        if (!name || !phone || !email) {
            return res.status(400).json({ message: 'Name, phone, and email are required.' });
        }
        const newWorker = await JobWorker.create({ name, phone, email });
        res.status(201).json({sucess:true,message:"Job worker reated successfullyy !!",newWorker});
    } catch (err) {
        console.log('Error creating job worker:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * ✏️ Edit an existing Job Worker
 * PUT /jobworkers/:id
 */
exports.updateJobWorker = async (req, res) => {
    try {
        const { jobWorkerId, name, phone, email } = req.body;

        if (!jobWorkerId) {
            console.warn("⚠️ jobWorkerId missing in request body.");
            return res.status(400).json({ error: "jobWorkerId is required." });
        }

        const worker = await JobWorker.findById(jobWorkerId);
        if (!worker) {
            console.warn(`⚠️ Job Worker not found: ${jobWorkerId}`);
            return res.status(404).json({ error: "Job Worker not found." });
        }

        // Update only provided fields
        if (name !== undefined) worker.name = name;
        if (phone !== undefined) worker.phone = phone;
        if (email !== undefined) worker.email = email;

        await worker.save();

        console.log(`✅ Job Worker updated: ${worker._id}`);
        return res.status(200).json({
            message: "Job Worker updated successfully.",
            worker
        });

    } catch (err) {
        console.error("❌ Error updating Job Worker:", err.message);
        return res.status(500).json({ error: "Server error while updating job worker." });
    }
};


/**
 * 🗑️ Delete a Job Worker
 * DELETE /jobworkers/:id
 */
exports.deleteJobWorker = async (req, res) => {
    try {
        const { jobWorkerId } = req.body;
        const worker = await JobWorker.findByIdAndDelete(jobWorkerId);
        if (!worker) {
            return res.status(404).json({ message: 'Job Worker not found.' });
        }
        res.json({ message: 'Job Worker deleted.', worker });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/**
 * 👀 View all Job Workers
 * GET /jobworkers
 */
exports.getAllJobWorkers = async (req, res) => {
    try {
        console.log('Fetching all job workers...');
        const workers = await JobWorker.find();

        if (!workers || workers.length === 0) {
            console.warn('⚠️ No job workers found.');
        }
        console.log(`📦 ${workers.length} job workers fetched successfully.`);
         // Return the list of job workers
        res.json({
            success: true,
            message: 'Job Workers fetched successfully.',
            workers
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};