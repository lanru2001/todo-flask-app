from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Task
from config import Config
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    try:
        task = Task(
            task_name=data['task_name'],
            task_description=data.get('task_description', ''),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
            initiator=data['initiator'],
            status=data.get('status', 'Pending')
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    
    try:
        if 'task_name' in data:
            task.task_name = data['task_name']
        if 'task_description' in data:
            task.task_description = data['task_description']
        if 'start_date' in data:
            task.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data:
            task.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        if 'initiator' in data:
            task.initiator = data['initiator']
        if 'status' in data:
            task.status = data['status']
        
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/tasks/search', methods=['GET'])
def search_tasks():
    query = request.args.get('q', '')
    tasks = Task.query.filter(
        (Task.task_name.ilike(f'%{query}%')) | 
        (Task.task_description.ilike(f'%{query}%'))
    ).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks/status/<status>', methods=['GET'])
def get_tasks_by_status(status):
    tasks = Task.query.filter_by(status=status).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/tasks/upcoming', methods=['GET'])
def get_upcoming_tasks():
    days = request.args.get('days', default=7, type=int)
    from datetime import date, timedelta
    end_date = date.today() + timedelta(days=days)
    tasks = Task.query.filter(
        Task.end_date.between(date.today(), end_date)
    ).order_by(Task.end_date.asc()).all()
    return jsonify([task.to_dict() for task in tasks])

if __name__ == '__main__':
    app.run(debug=True)
