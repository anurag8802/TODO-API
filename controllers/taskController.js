import Task from '../modals/Task.js';

export const createTask = async(req,res)=>{
    const {title,description}= req.body;
    if(!title || !description) {
        return res.status(400).json({message: 'Please fill all fields'});
    }
    const task = await Task.create({title, description, user: req.user._id});
    res.status(201).json(task);
};

export const getTasks = async(req,res)=>{
    const {status} = req.query;
    const filter = {user: req.user._id};
    if(status) filter.status = status;
    const tasks = await Task.find(filter);
    res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user._id.toString())
    return res.status(404).json({ message: "Task not found or not authorized" });

  task.status = req.body.status || task.status;
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user._id.toString())
    return res.status(404).json({ message: "Task not found or not authorized" });

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
};
