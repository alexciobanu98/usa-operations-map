document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification functionality
    initNotifications();
    
    // Initialize profile dropdown
    initProfileDropdown();
    
    // Initialize chat functionality
    initChat();
    
    // Initialize team creation modal
    initTeamModal();
    
    // Initialize task modal
    initTaskModal();
    
    // Initialize team and project selection
    initTeamSelection();
    
    // Initialize task checkboxes
    initTaskCheckboxes();
    
    // Initialize real-time presence simulation
    initPresenceSimulation();
});

// Notification functionality
function initNotifications() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationBadge = document.getElementById('notificationBadge');
    const markAllRead = document.getElementById('markAllRead');
    
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });
    
    markAllRead.addEventListener('click', function() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        notificationBadge.style.display = 'none';
    });
    
    document.addEventListener('click', function(e) {
        if (!notificationBell.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });
}

// Profile dropdown functionality
function initProfileDropdown() {
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');
    
    profileButton.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function(e) {
        if (!profileButton.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });
}

// Chat functionality
function initChat() {
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    // Send message on button click
    sendMessageBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message on Enter key press
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            // Create a new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';
            messageElement.innerHTML = `
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Doe" class="message-avatar">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">John Doe</span>
                        <span class="message-time">Just now</span>
                    </div>
                    <div class="message-body">
                        <p>${messageText}</p>
                    </div>
                </div>
            `;
            
            // Add the message to the chat
            chatMessages.appendChild(messageElement);
            
            // Clear the input field
            messageInput.value = '';
            
            // Scroll to the bottom of the chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate a response after a delay
            simulateResponse(messageText);
        }
    }
    
    // Function to simulate a response
    function simulateResponse(messageText) {
        // Only respond if the message contains a question or specific keywords
        if (messageText.includes('?') || 
            messageText.toLowerCase().includes('material') || 
            messageText.toLowerCase().includes('reinforcement') ||
            messageText.toLowerCase().includes('budget') ||
            messageText.toLowerCase().includes('timeline')) {
            
            setTimeout(() => {
                // Choose a random team member to respond
                const members = [
                    {
                        name: 'Jane Smith',
                        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                        responses: [
                            "I'll look into the structural requirements and get back to you.",
                            "Based on my calculations, we'll need additional reinforcement materials.",
                            "I've updated the engineering specifications to account for the structural concerns."
                        ]
                    },
                    {
                        name: 'Mike Johnson',
                        avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
                        responses: [
                            "I can check our inventory for the materials we need.",
                            "We should have most of the reinforcement materials in stock.",
                            "I'll coordinate with the warehouse to get the materials delivered to the site."
                        ]
                    },
                    {
                        name: 'Robert Brown',
                        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
                        responses: [
                            "I've worked on similar projects before. We should consider reinforcing the base as well.",
                            "Let me review the budget to see if we can accommodate these changes.",
                            "I'll update the project timeline to reflect these additional requirements."
                        ]
                    }
                ];
                
                const randomMember = members[Math.floor(Math.random() * members.length)];
                const randomResponse = randomMember.responses[Math.floor(Math.random() * randomMember.responses.length)];
                
                // Create a new message element for the response
                const responseElement = document.createElement('div');
                responseElement.className = 'chat-message';
                responseElement.innerHTML = `
                    <img src="${randomMember.avatar}" alt="${randomMember.name}" class="message-avatar">
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-sender">${randomMember.name}</span>
                            <span class="message-time">Just now</span>
                        </div>
                        <div class="message-body">
                            <p>${randomResponse}</p>
                        </div>
                    </div>
                `;
                
                // Add the response to the chat
                chatMessages.appendChild(responseElement);
                
                // Scroll to the bottom of the chat
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Show typing indicator for another team member
                showTypingIndicator();
            }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
        }
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        // Only show typing indicator sometimes
        if (Math.random() > 0.3) {
            const members = [
                { name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                { name: 'Mike Johnson', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
                { name: 'Robert Brown', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
            ];
            
            const randomMember = members[Math.floor(Math.random() * members.length)];
            
            // Create typing indicator
            const typingElement = document.createElement('div');
            typingElement.className = 'chat-message typing-indicator';
            typingElement.innerHTML = `
                <img src="${randomMember.avatar}" alt="${randomMember.name}" class="message-avatar">
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            
            // Add the typing indicator to the chat
            chatMessages.appendChild(typingElement);
            
            // Scroll to the bottom of the chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Remove typing indicator after a delay
            setTimeout(() => {
                typingElement.remove();
            }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
        }
    }
}

// Team creation modal functionality
function initTeamModal() {
    const createTeamBtn = document.getElementById('createTeamBtn');
    const createTeamModal = document.getElementById('createTeamModal');
    const closeTeamModal = document.getElementById('closeTeamModal');
    const cancelTeamForm = document.getElementById('cancelTeamForm');
    const createTeamForm = document.getElementById('createTeamForm');
    const selectedMembers = document.getElementById('selectedMembers');
    const addMemberBtns = document.querySelectorAll('.add-member-btn');
    
    // Open modal
    createTeamBtn.addEventListener('click', function() {
        createTeamModal.classList.add('active');
    });
    
    // Close modal
    function closeModal() {
        createTeamModal.classList.remove('active');
    }
    
    closeTeamModal.addEventListener('click', closeModal);
    cancelTeamForm.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === createTeamModal) {
            closeModal();
        }
    });
    
    // Add team members
    addMemberBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const memberId = this.getAttribute('data-id');
            const memberName = this.parentElement.querySelector('.member-name').textContent;
            const memberAvatar = this.parentElement.querySelector('.member-avatar').src;
            
            // Check if member is already selected
            if (!document.querySelector(`.selected-member[data-id="${memberId}"]`)) {
                // Create selected member element
                const memberElement = document.createElement('div');
                memberElement.className = 'selected-member';
                memberElement.setAttribute('data-id', memberId);
                memberElement.innerHTML = `
                    <img src="${memberAvatar}" alt="${memberName}" class="member-avatar">
                    <span class="member-name">${memberName}</span>
                    <button class="remove-member-btn" data-id="${memberId}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add to selected members
                selectedMembers.appendChild(memberElement);
                
                // Add event listener to remove button
                memberElement.querySelector('.remove-member-btn').addEventListener('click', function() {
                    memberElement.remove();
                });
            }
        });
    });
    
    // Handle form submission
    createTeamForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const teamName = document.getElementById('teamName').value;
        const teamDescription = document.getElementById('teamDescription').value;
        const selectedMemberElements = document.querySelectorAll('.selected-member');
        const members = Array.from(selectedMemberElements).map(el => el.getAttribute('data-id'));
        
        // Create team object
        const teamData = {
            name: teamName,
            description: teamDescription,
            members: members
        };
        
        // Log team data (would be sent to server in a real app)
        console.log('Team Data:', teamData);
        
        // Show success message
        showToast('Team created successfully!');
        
        // Close modal
        closeModal();
        
        // Reset form
        createTeamForm.reset();
        selectedMembers.innerHTML = '';
        
        // Add team to the list (for demo purposes)
        addTeamToList(teamName);
    });
    
    // Function to add team to the list
    function addTeamToList(teamName) {
        const teamList = document.querySelector('.team-list');
        const teamItem = document.createElement('li');
        teamItem.className = 'team-item';
        teamItem.innerHTML = `
            <span class="team-icon"><i class="fas fa-users"></i></span>
            <span class="team-name">${teamName}</span>
            <span class="team-badge">New</span>
        `;
        
        teamList.appendChild(teamItem);
        
        // Add click event to select the team
        teamItem.addEventListener('click', function() {
            document.querySelectorAll('.team-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    }
}

// Task modal functionality
function initTaskModal() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskModal = document.getElementById('addTaskModal');
    const closeTaskModal = document.getElementById('closeTaskModal');
    const cancelTaskForm = document.getElementById('cancelTaskForm');
    const addTaskForm = document.getElementById('addTaskForm');
    
    // Open modal
    addTaskBtn.addEventListener('click', function() {
        addTaskModal.classList.add('active');
    });
    
    // Close modal
    function closeModal() {
        addTaskModal.classList.remove('active');
    }
    
    closeTaskModal.addEventListener('click', closeModal);
    cancelTaskForm.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === addTaskModal) {
            closeModal();
        }
    });
    
    // Handle form submission
    addTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskAssignee = document.getElementById('taskAssignee');
        const assigneeName = taskAssignee.options[taskAssignee.selectedIndex].text;
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskPriority = document.getElementById('taskPriority').value;
        
        // Create task object
        const taskData = {
            name: taskName,
            description: taskDescription,
            assignee: taskAssignee.value,
            assigneeName: assigneeName,
            dueDate: taskDueDate,
            priority: taskPriority
        };
        
        // Log task data (would be sent to server in a real app)
        console.log('Task Data:', taskData);
        
        // Show success message
        showToast('Task added successfully!');
        
        // Close modal
        closeModal();
        
        // Reset form
        addTaskForm.reset();
        
        // Add task to the list (for demo purposes)
        addTaskToList(taskData);
    });
    
    // Function to add task to the list
    function addTaskToList(taskData) {
        const taskList = document.querySelector('.task-list');
        const taskId = 'task' + Math.floor(Math.random() * 10000);
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        // Format due date
        const dueDate = new Date(taskData.dueDate);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        let dueDateText;
        if (dueDate.toDateString() === today.toDateString()) {
            dueDateText = 'Today';
        } else if (dueDate.toDateString() === tomorrow.toDateString()) {
            dueDateText = 'Tomorrow';
        } else {
            dueDateText = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        taskItem.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="${taskId}">
                <label for="${taskId}"></label>
            </div>
            <div class="task-info">
                <span class="task-name">${taskData.name}</span>
                <span class="task-meta">Due: ${dueDateText} · Assigned to: ${taskData.assigneeName}</span>
            </div>
        `;
        
        // Add priority class
        if (taskData.priority === 'high') {
            taskItem.classList.add('high-priority');
        } else if (taskData.priority === 'medium') {
            taskItem.classList.add('medium-priority');
        }
        
        taskList.insertBefore(taskItem, document.getElementById('addTaskBtn').parentElement);
        
        // Add event listener to checkbox
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        });
    }
}

// Team and project selection functionality
function initTeamSelection() {
    const teamItems = document.querySelectorAll('.team-item');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Team selection
    teamItems.forEach(item => {
        item.addEventListener('click', function() {
            teamItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update header info
            const teamName = this.querySelector('.team-name').textContent;
            const headerInfo = document.querySelector('.header-info');
            headerInfo.querySelector('h2').textContent = teamName;
            
            // Show toast notification
            showToast(`Switched to ${teamName}`);
        });
    });
    
    // Project selection
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            projectItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Update header info
            const projectName = this.querySelector('.project-name').textContent;
            const teamName = document.querySelector('.team-item.active .team-name').textContent;
            const headerInfo = document.querySelector('.header-info');
            headerInfo.querySelector('p').textContent = `5 members · ${projectName}`;
            
            // Show toast notification
            showToast(`Switched to ${projectName}`);
        });
    });
}

// Task checkbox functionality
function initTaskCheckboxes() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.classList.add('completed');
                
                // Show toast notification
                const taskName = taskItem.querySelector('.task-name').textContent;
                showToast(`Task completed: ${taskName}`);
            } else {
                taskItem.classList.remove('completed');
            }
        });
    });
}

// Real-time presence simulation
function initPresenceSimulation() {
    const memberItems = document.querySelectorAll('.member-item');
    
    // Randomly change member status every 30-60 seconds
    setInterval(() => {
        // Only change status sometimes
        if (Math.random() > 0.7) {
            const randomMember = memberItems[Math.floor(Math.random() * memberItems.length)];
            const currentStatus = Array.from(randomMember.classList).find(cls => 
                ['online', 'away', 'offline'].includes(cls)
            );
            
            // Remove current status
            randomMember.classList.remove(currentStatus);
            
            // Determine new status
            const statuses = ['online', 'away', 'offline'];
            let newStatus;
            
            // Higher probability to be online or away than offline
            const rand = Math.random();
            if (rand < 0.5) {
                newStatus = 'online';
            } else if (rand < 0.8) {
                newStatus = 'away';
            } else {
                newStatus = 'offline';
            }
            
            // Add new status
            randomMember.classList.add(newStatus);
            
            // Show notification for status changes (except offline to avoid too many notifications)
            if (newStatus !== 'offline') {
                const memberName = randomMember.querySelector('.member-name').textContent;
                const statusText = newStatus === 'online' ? 'online' : 'away';
                showToast(`${memberName} is now ${statusText}`);
            }
        }
    }, 30000 + Math.random() * 30000); // Random interval between 30-60 seconds
}

// Toast notification function
function showToast(message) {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    document.getElementById('toast-container').appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
