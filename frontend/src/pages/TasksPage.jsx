import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTaskStatus
} from '../features/tasks/taskSlice';

const statusOptions = ['Pending', 'In Progress', 'Completed'];

function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const taskData = {
      title: formData.title,
      description: formData.description,
      category: formData.category
    };

    if (formData.deadline) {
      taskData.deadline = formData.deadline;
    }

    try {
      await dispatch(createTask(taskData)).unwrap();
      setFormData({
        title: '',
        description: '',
        category: '',
        deadline: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Task could not be created');
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateTaskStatus({ id, status }));
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <h1>Tasks</h1>
      </section>

      <form className="task-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <label>
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </label>

        <div className="task-form-row">
          <label>
            Category
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>

          <label>
            Deadline
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit">Create Task</button>
      </form>

      <section className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet.</p>
        ) : (
          tasks.map((task) => {
            const isOverdue = task.deadline && new Date(task.deadline).getTime() <= Date.now();
            const isHighPriority = !isOverdue && Number(task.priority) >= 200;

            return (
              <article
                className={`task-item ${isOverdue ? 'overdue' : isHighPriority ? 'high-priority' : ''}`}
                key={task._id}
              >
                <div className="task-content">
                  <h2>{task.title}</h2>
                  {task.description && <p>{task.description}</p>}
                  <div className="task-meta">
                    {task.category && <span>{task.category}</span>}
                    {task.deadline && <span>{new Date(task.deadline).toLocaleDateString()}</span>}
                    <span className={`task-priority ${isOverdue ? 'overdue' : isHighPriority ? 'high' : ''}`}>
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task._id, event.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default TasksPage;
