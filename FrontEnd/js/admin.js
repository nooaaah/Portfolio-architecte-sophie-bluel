// Authentication and Modal Management System
document.addEventListener('DOMContentLoaded', function() {
    // Only run on portfolio page
    if (!document.getElementById('portfolio')) return;

    // 1. First check authentication status
    checkAuthStatus();
});

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const isAdmin = token !== null;

    if (isAdmin) {
        setupAdminInterface();
    } else {
        cleanupAdminInterface();
    }
}

function setupAdminInterface() {
    // Create and show auth banner
    createAuthBanner();
    // Update login button to logout
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.textContent = 'logout';
        loginButton.href = '#';
        loginButton.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            window.location.reload();
        };
    }

    // Hide filters
    const divFilter = document.getElementById('divFilter');
    if (divFilter) {
        divFilter.style.display = 'none';
    }

    // Create and setup modify button
    const modifyButton = createModifyButton();
    if (!modifyButton) {
        console.error('Failed to create modify button');
        return;
    }

    // Create modal if doesn't exist
    let modal = document.getElementById('editModal');
    if (!modal) {
        modal = createEditModal();
    }

    // Setup click handler
    modifyButton.addEventListener('click', function() {
        modal.style.display = 'block';
        loadModalContent();
    });
}

function cleanupAdminInterface() {

    // Remove auth banner if exists
    const authBanner = document.getElementById('authBanner');
    if (authBanner) authBanner.remove();

    // Remove modify button if exists
    const modifyButton = document.getElementById('modifyButton');
    if (modifyButton) modifyButton.remove();

    // Remove modal if exists
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();

    // Reset login button
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.textContent = 'login';
        loginButton.href = 'login.html';
        loginButton.onclick = null;
    }

    // Show filters
    const divFilter = document.getElementById('divFilter');
    if (divFilter) {
        divFilter.style.display = 'flex';
    }
}

function createAuthBanner() {
    // Remove existing banner if any
    const existingBanner = document.getElementById('authBanner');
    if (existingBanner) existingBanner.remove();

    // Create new banner
    const banner = document.createElement('div');
    banner.id = 'authBanner';
    banner.className = 'auth-banner';
    banner.innerHTML = `
        <i class="fa-solid fa-pen-to-square"></i>
        <span>Mode édition</span>
    `;

    // Add banner to the top of the body
    document.body.insertBefore(banner, document.body.firstChild);
}



function createModifyButton() {
    // Remove existing button if any
    const oldButton = document.getElementById('modifyButton');
    if (oldButton) oldButton.remove();

    // Create new button
    const button = document.createElement('button');
    button.id = 'modifyButton';
    button.className = 'modify-btn';
    button.innerHTML = '<i class="fas fa-edit"></i> modifier';

    // Find where to place the button
    const portfolioTitle = document.getElementById('title-portfolio');
    if (!portfolioTitle) {
        console.error('Could not find portfolio title');
        return null;
    }

    // Create container if needed
    let container = portfolioTitle.parentElement;
    if (!container.classList.contains('portfolio-header')) {
        const newContainer = document.createElement('div');
        newContainer.className = 'portfolio-header';
        portfolioTitle.parentNode.insertBefore(newContainer, portfolioTitle);
        newContainer.appendChild(portfolioTitle);
        container = newContainer;
    }

    // Add button to container
    container.appendChild(button);
    return button;
}

function createEditModal() {
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.className = 'modal';
    modal.style.display = 'none';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="closeDiv">
            <span class="close">&times;</span>
            </div>
            <div id="modalGalleryView">
                <h2>Galerie photo</h2>
                <div class="modal-gallery" id="modalGallery"></div>
                <div class="modal-footer">
                    <button id="addPhotoBtn" class="modal-button">Ajouter une photo</button>
                </div>
            </div>
            <div id="modalAddPhotoView" style="display:none;">
                <div class="top-btn">
                <button type="button" id="backBtn"><i class="fa-solid fa-arrow-left"></i></button>
                </div>
                <h2>Ajout photo</h2>
                <form id="uploadForm">
                    <div class="form-group">
                        <div class="image-upload" id="uploadContainer">
                            <i class="fa-regular fa-image" id="uploadIcon"></i>
                            <input type="file" id="imageInput" accept="image/*">
                            <label for="imageInput">+ Ajouter photo</label>
                            <p>jpg, png : 4mo max</p>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="imageTitle">Titre</label>
                        <input type="text" id="imageTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="imageCategory">Catégorie</label>
                        <select id="imageCategory" required></select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Valider</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupModalEvents(modal);
    return modal;
}

function setupModalEvents(modal) {
    // Close button
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add photo button
    const addPhotoBtn = modal.querySelector('#addPhotoBtn');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', function() {
            document.getElementById('modalGalleryView').style.display = 'none';
            document.getElementById('modalAddPhotoView').style.display = 'block';
            loadCategories();
        });
    }

    // Back button
    const backBtn = modal.querySelector('#backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.getElementById('modalGalleryView').style.display = 'block';
            document.getElementById('modalAddPhotoView').style.display = 'none';
        });
    }

    // Form submission
    const uploadForm = modal.querySelector('#uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleImageUpload);
    }

    // Get form elements for validation
    const imageInput = modal.querySelector('#imageInput');
    const titleInput = modal.querySelector('#imageTitle');
    const categorySelect = modal.querySelector('#imageCategory');
    const submitBtn = modal.querySelector('.submit-btn');

    // Function to validate form and update button style
    function validateForm() {
        const isImageSelected = imageInput.files && imageInput.files.length > 0;
        const isTitleFilled = titleInput.value.trim() !== '';
        const isCategorySelected = categorySelect.value !== '';
        
        if (isImageSelected && isTitleFilled && isCategorySelected) {
            submitBtn.classList.add('active');
            return true;
        } else {
            submitBtn.classList.remove('active');
            return false;
        }
    }

    // Add event listeners for validation
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const uploadContainer = modal.querySelector('#uploadContainer');
                    const icon = uploadContainer.querySelector('#uploadIcon');
                    const label = uploadContainer.querySelector('label[for="imageInput"]');
                    const sizeText = uploadContainer.querySelector('p');
                    
                    // Hide elements
                    if (icon) icon.style.display = 'none';
                    if (label) label.style.display = 'none';
                    if (sizeText) sizeText.style.display = 'none';
                    
                    // Create preview image
                    const previewImg = document.createElement('img');
                    previewImg.src = event.target.result;
                    
                    // Keep reference to the original file input
                    const originalInput = e.target;
                    
                    // Clear container and add preview
                    uploadContainer.innerHTML = '';
                    uploadContainer.appendChild(previewImg);
                    
                    // Recreate hidden file input but keep the file reference
                    const newInput = document.createElement('input');
                    newInput.type = 'file';
                    newInput.id = 'imageInput';
                    newInput.accept = 'image/*';
                    newInput.style.display = 'none';
                    
                    // Transfer the file to the new input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    newInput.files = dataTransfer.files;
                    
                    uploadContainer.appendChild(newInput);
                    
                    // Click preview to select new image
                    previewImg.addEventListener('click', function() {
                        newInput.click();
                    });

                    // Update the form validation with the new input
                    newInput.addEventListener('change', function(e) {
                        originalInput.files = e.target.files;
                        validateForm();
                    });
                };
                reader.readAsDataURL(file);
            }
            validateForm();
        });
    }

    // Validate on title input
    if (titleInput) {
        titleInput.addEventListener('input', validateForm);
    }

    // Validate on category change
    if (categorySelect) {
        categorySelect.addEventListener('change', validateForm);
    }

    // Initial validation when opening modal
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', validateForm);
    }
}

async function loadModalContent() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        displayWorksInModal(works);
    } catch (error) {
        console.error('Error loading works:', error);
    }
}

function displayWorksInModal(works) {
    const gallery = document.getElementById('modalGallery');
    if (!gallery) return;

    gallery.innerHTML = '';

    works.forEach(work => {
        const workElement = document.createElement('div');
        workElement.className = 'modal-work';
        workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-btn" data-id="${work.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        gallery.appendChild(workElement);

        // Add delete event
        const deleteBtn = workElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteWork(work.id, workElement);
        });
    });
}

async function deleteWork(workId, element) {
    if (!confirm('Supprimer ce projet ?')) return;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            element.remove();
            // Refresh main gallery
            refreshMainGallery();
        } else {
            console.error('Delete failed:', response.status);
        }
    } catch (error) {
        console.error('Error deleting work:', error);
    }
}

async function refreshMainGallery() {
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        gallery.innerHTML = '';
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        works.forEach(work => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            `;
            gallery.appendChild(figure);
        });
    }
}

async function loadCategories() {
    const select = document.getElementById('imageCategory');
    if (!select) return;

    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        select.innerHTML = '';

        // Add empty option first
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        select.appendChild(emptyOption);
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function handleImageUpload(e) {
    e.preventDefault();

    const imageInput = document.getElementById('imageInput');
    const titleInput = document.getElementById('imageTitle');
    const categorySelect = document.getElementById('imageCategory');
    const uploadContainer = document.getElementById('uploadContainer');

    if (!validateForm()) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });

        if (response.ok) {
            // Reset form
            imageInput.value = '';
            titleInput.value = '';
            categorySelect.value = '';
            
            // Reset upload container
            if (uploadContainer) {
                uploadContainer.innerHTML = `
                    <i class="fa-regular fa-image" id="uploadIcon"></i>
                    <input type="file" id="imageInput" accept="image/*">
                    <label for="imageInput">+ Ajouter photo</label>
                    <p>jpg, png : 4mo max</p>
                `;
                // Reattach event listener
                const newInput = uploadContainer.querySelector('#imageInput');
                if (newInput) {
                    const modal = document.getElementById('editModal');
                    setupModalEvents(modal);
                }
            }
            
            // Refresh galleries
            loadModalContent();
            refreshMainGallery();
            
            // Switch back to gallery view
            document.getElementById('modalGalleryView').style.display = 'block';
            document.getElementById('modalAddPhotoView').style.display = 'none';
        } else {
            console.error('Upload failed:', response.status);
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
}

// Helper function to validate form (used in handleImageUpload)
function validateForm() {
    const imageInput = document.getElementById('imageInput');
    const titleInput = document.getElementById('imageTitle');
    const categorySelect = document.getElementById('imageCategory');
    
    return imageInput.files && imageInput.files.length > 0 && 
           titleInput.value.trim() !== '' && 
           categorySelect.value !== '';
}