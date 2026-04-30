const mongoose = require('mongoose');
const Task = require('../models/Task');

const getAnalytics = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [summary] = await Task.aggregate([
    {
      $match: { user: userId }
    },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
                }
              },
              pendingTasks: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
                }
              }
            }
          }
        ],
        completedToday: [
          {
            $match: {
              status: 'Completed',
              updatedAt: { $gte: startOfToday }
            }
          },
          {
            $count: 'count'
          }
        ],
        categoryDistribution: [
          {
            $group: {
              _id: {
                $ifNull: ['$category', 'Uncategorized']
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { count: -1, _id: 1 }
          }
        ]
      }
    },
    {
      $project: {
        totalTasks: {
          $ifNull: [{ $arrayElemAt: ['$totals.totalTasks', 0] }, 0]
        },
        completedTasks: {
          $ifNull: [{ $arrayElemAt: ['$totals.completedTasks', 0] }, 0]
        },
        pendingTasks: {
          $ifNull: [{ $arrayElemAt: ['$totals.pendingTasks', 0] }, 0]
        },
        tasksCompletedToday: {
          $ifNull: [{ $arrayElemAt: ['$completedToday.count', 0] }, 0]
        },
        categoryDistribution: '$categoryDistribution'
      }
    }
  ]);

  res.json(
    summary || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      tasksCompletedToday: 0,
      categoryDistribution: []
    }
  );
};

module.exports = {
  getAnalytics
};