from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Todo
from config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Todo API is running"}), 200


@app.route('/api/todos', methods=['GET'])
def get_todos():
    try:
        status_filter = request.args.get('status')
        priority_filter = request.args.get('priority')

        query = Todo.query
        if status_filter:
            query = query.filter_by(status=status_filter)
        if priority_filter:
            query = query.filter_by(priority=priority_filter)

        todos = query.order_by(Todo.created_at.desc()).all()
        return jsonify([todo.to_dict() for todo in todos]), 200
    except Exception as e:
        logger.error(f"Error fetching todos: {e}")
        return jsonify({"error": "Failed to fetch todos"}), 500


@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    return jsonify(todo.to_dict()), 200


@app.route('/api/todos', methods=['POST'])
def create_todo():
    try:
        data = request.get_json()
        if not data or not data.get('title'):
            return jsonify({"error": "Title is required"}), 400

        todo = Todo(
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            due_date=data.get('due_date')
        )
        db.session.add(todo)
        db.session.commit()
        logger.info(f"Created todo: {todo.id}")
        return jsonify(todo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating todo: {e}")
        return jsonify({"error": "Failed to create todo"}), 500


@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    try:
        todo = Todo.query.get_or_404(todo_id)
        data = request.get_json()

        if 'title' in data:
            todo.title = data['title']
        if 'description' in data:
            todo.description = data['description']
        if 'status' in data:
            todo.status = data['status']
        if 'priority' in data:
            todo.priority = data['priority']
        if 'due_date' in data:
            todo.due_date = data['due_date']

        db.session.commit()
        return jsonify(todo.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating todo: {e}")
        return jsonify({"error": "Failed to update todo"}), 500


@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    try:
        todo = Todo.query.get_or_404(todo_id)
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Todo deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting todo: {e}")
        return jsonify({"error": "Failed to delete todo"}), 500


@app.route('/api/todos/<int:todo_id>/toggle', methods=['PATCH'])
def toggle_todo(todo_id):
    try:
        todo = Todo.query.get_or_404(todo_id)
        todo.status = 'completed' if todo.status == 'pending' else 'pending'
        db.session.commit()
        return jsonify(todo.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to toggle todo"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
