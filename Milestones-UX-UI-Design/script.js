class TimelineController {
    constructor() {
        this.timeline = document.getElementById('timeline');
        this.timelineWrapper = document.getElementById('timelineWrapper');
        this.scrollBtnLeft = document.getElementById('scrollBtnLeft');
        this.scrollBtnRight = document.getElementById('scrollBtnRight');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        
        // Touch and swipe properties
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialTransform = 0;
        this.currentTransform = 0;
        this.velocity = 0;
        this.lastMoveTime = 0;
        this.momentumAnimation = null;
        
        // Navigation properties
        this.maxTransform = 0;
        this.minTransform = 0;
        
        this.init();
    }
    
    init() {
        this.calculateBounds();
        this.setupEventListeners();
        this.updateVisibleItems();
        this.updateNavigationButtons();
        this.adjustPopupPositions();
        
        // Initial animation of timeline items
        setTimeout(() => {
            this.timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 100);
            });
        }, 500);
    }
    
    calculateBounds() {
        const timelineWidth = this.timeline.scrollWidth;
        const wrapperWidth = this.timelineWrapper.clientWidth;
        const firstItem = this.timeline.firstElementChild;
        const lastItem = this.timeline.lastElementChild;
        
        if (!firstItem || !lastItem) return;
        
        // Get the position of first and last dots relative to timeline
        const firstDotPos = firstItem.offsetLeft;
        const lastDotPos = lastItem.offsetLeft;
        
        // Calculate transforms to center first and last dots in viewport
        // maxTransform: when first dot is centered (most right position)
        this.maxTransform = (wrapperWidth / 2) - firstDotPos;
        
        // minTransform: when last dot is centered (most left position)
        this.minTransform = (wrapperWidth / 2) - lastDotPos;
        
        // Ensure minTransform is not greater than maxTransform
        // This prevents the timeline from being scrolled beyond the boundaries
        if (this.minTransform > this.maxTransform) {
            this.minTransform = this.maxTransform;
        }
        

        
        // If timeline is shorter than wrapper, center it
        if (timelineWidth < wrapperWidth) {
            const centeringOffset = (wrapperWidth - timelineWidth) / 2;
            this.maxTransform = centeringOffset;
            this.minTransform = centeringOffset;
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.scrollBtnLeft.addEventListener('click', () => this.scrollTimeline('left'));
        this.scrollBtnRight.addEventListener('click', () => this.scrollTimeline('right'));
        
        // Touch events for swipe functionality
        this.timelineWrapper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.timelineWrapper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.timelineWrapper.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Mouse events for desktop dragging
        this.timelineWrapper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Prevent default drag behavior
        this.timeline.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Window resize
        window.addEventListener('resize', () => {
            this.calculateBounds();
            this.updateNavigationButtons();
            this.adjustPopupPositions();
        });
    }
    
    handleTouchStart(e) {
        this.startTouch(e.touches[0].clientX);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        this.moveTouch(e.touches[0].clientX);
    }
    
    handleTouchEnd(e) {
        this.endTouch();
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        this.startTouch(e.clientX);
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.moveTouch(e.clientX);
        }
    }
    
    handleMouseUp(e) {
        this.endTouch();
    }
    
    startTouch(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        this.currentX = clientX;
        this.initialTransform = this.currentTransform;
        this.velocity = 0;
        this.lastMoveTime = Date.now();
        
        // Cancel any ongoing momentum animation
        if (this.momentumAnimation) {
            cancelAnimationFrame(this.momentumAnimation);
        }
        
        // Add grabbing cursor
        this.timelineWrapper.style.cursor = 'grabbing';
    }
    
    moveTouch(clientX) {
        if (!this.isDragging) return;
        
        this.currentX = clientX;
        const deltaX = this.currentX - this.startX;
        const newTransform = this.initialTransform + deltaX;
        
        // Calculate velocity for momentum
        const now = Date.now();
        const timeDelta = now - this.lastMoveTime;
        if (timeDelta > 0) {
            this.velocity = (clientX - this.lastClientX) / timeDelta;
        }
        this.lastClientX = clientX;
        this.lastMoveTime = now;
        
        // Apply transform with boundaries
        this.setTransform(newTransform);
    }
    
    endTouch() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.timelineWrapper.style.cursor = 'grab';
        
        // Apply momentum if velocity is significant
        if (Math.abs(this.velocity) > 0.1) {
            this.applyMomentum();
        } else {
            this.updateNavigationButtons();
        }
    }
    
    applyMomentum() {
        const friction = 0.95;
        const minVelocity = 0.01;
        
        const animate = () => {
            this.velocity *= friction;
            
            // Stop momentum if we hit boundaries
            const proposedTransform = this.currentTransform + this.velocity * 16;
            if (proposedTransform >= this.maxTransform || proposedTransform <= this.minTransform) {
                this.velocity = 0;
            }
            
            if (Math.abs(this.velocity) < minVelocity) {
                this.updateNavigationButtons();
                return;
            }
            
            const newTransform = this.currentTransform + this.velocity * 16; // 16ms frame time
            this.setTransform(newTransform);
            
            this.momentumAnimation = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    setTransform(transform) {
        // Enforce strict boundaries - never allow dots to go out of view
        const boundedTransform = Math.max(this.minTransform, Math.min(this.maxTransform, transform));
        
        this.currentTransform = boundedTransform;
        this.timeline.style.transform = `translateX(${boundedTransform}px)`;
        
        this.updateVisibleItems();
        this.adjustPopupPositions();
    }
    
    scrollTimeline(direction) {
        const scrollAmount = 300;
        let newTransform;
        
        if (direction === 'left') {
            newTransform = this.currentTransform + scrollAmount;
        } else {
            newTransform = this.currentTransform - scrollAmount;
        }
        
        // Apply boundaries
        newTransform = Math.max(this.minTransform, Math.min(this.maxTransform, newTransform));
        
        // Animate to new position
        this.animateToTransform(newTransform);
    }
    
    animateToTransform(targetTransform) {
        const startTransform = this.currentTransform;
        const distance = targetTransform - startTransform;
        const duration = 500;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentTransform = startTransform + distance * easeOut;
            
            this.setTransform(currentTransform);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.updateNavigationButtons();
            }
        };
        
        animate();
    }
    
    updateVisibleItems() {
        const wrapperRect = this.timelineWrapper.getBoundingClientRect();
        
        this.timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const isVisible = itemRect.right > wrapperRect.left && itemRect.left < wrapperRect.right;
            
            if (isVisible && !item.classList.contains('visible')) {
                item.classList.add('visible');
            }
        });
    }
    
    updateNavigationButtons() {
        // Show/hide navigation buttons based on exact boundary positions
        if (this.currentTransform >= this.maxTransform) {
            this.scrollBtnLeft.classList.remove('show');
        } else {
            this.scrollBtnLeft.classList.add('show');
        }
        
        if (this.currentTransform <= this.minTransform) {
            this.scrollBtnRight.classList.remove('show');
        } else {
            this.scrollBtnRight.classList.add('show');
        }
    }
    
    adjustPopupPositions() {
        const wrapperRect = this.timelineWrapper.getBoundingClientRect();
        
        this.timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const popup = item.querySelector('.timeline-content');
            
            // Remove existing positioning classes
            item.classList.remove('edge-left', 'edge-right');
            
            // Check if popup would extend beyond wrapper bounds
            const popupWidth = 280; // max-width from CSS
            const itemCenter = itemRect.left + itemRect.width / 2;
            const popupLeft = itemCenter - popupWidth / 2;
            const popupRight = itemCenter + popupWidth / 2;
            
            // Adjust positioning for edge cases
            if (popupLeft < wrapperRect.left + 20) {
                item.classList.add('edge-left');
            } else if (popupRight > wrapperRect.right - 20) {
                item.classList.add('edge-right');
            }
        });
    }
}

// Initialize the timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimelineController();
});

// Handle visibility changes and window focus for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations when tab is not visible
        const timelineController = window.timelineController;
        if (timelineController && timelineController.momentumAnimation) {
            cancelAnimationFrame(timelineController.momentumAnimation);
        }
    }
});
