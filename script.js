// === ПРОВЕРКА ЗАГРУЗКИ ===
console.log('=== StuntRiding 3D - Only Spokes Rotated 90 Degrees ===');
console.log('Script loaded');
console.log('Babylon.js exists:', typeof BABYLON !== 'undefined');

const canvas = document.getElementById('three-canvas');

if (!canvas) {
    console.error('❌ Canvas not found!');
} else if (typeof BABYLON === 'undefined') {
    console.error('❌ Babylon.js not loaded!');
} else {
    console.log('✅ Starting Wheel with Rotated Spokes 3D scene...');
    
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.06, 0.06, 0.1, 1);

    // === КАМЕРА ===
    const camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 1.5, Math.PI / 3, 3.0, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 30;
    camera.lowerRadiusLimit = 1.5;
    camera.upperRadiusLimit = 6.0;
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.3;

    // === ОСВЕЩЕНИЕ ===
    const hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0.5, 1, 0.3), scene);
    hemiLight.intensity = 0.7;
    hemiLight.diffuse = new BABYLON.Color3(1, 0.95, 0.9);
    hemiLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.15);
    
    const keyLight = new BABYLON.PointLight("key", new BABYLON.Vector3(2, 3, 2), scene);
    keyLight.intensity = 1.0;
    keyLight.diffuse = new BABYLON.Color3(1, 0.95, 0.9);
    
    const fillLight = new BABYLON.PointLight("fill", new BABYLON.Vector3(-2, 1.5, -1.5), scene);
    fillLight.intensity = 0.5;
    fillLight.diffuse = new BABYLON.Color3(0.7, 0.7, 0.8);
    
    const sideLight = new BABYLON.PointLight("side", new BABYLON.Vector3(-1, 2, 2.5), scene);
    sideLight.intensity = 0.6;
    sideLight.diffuse = new BABYLON.Color3(1, 0.9, 0.8);
    
    const bottomLight = new BABYLON.PointLight("bottom", new BABYLON.Vector3(0, -0.5, 1.5), scene);
    bottomLight.intensity = 0.3;
    bottomLight.diffuse = new BABYLON.Color3(0.8, 0.8, 1);

    // === ГЛАВНАЯ ГРУППА ===
    const mainGroup = new BABYLON.TransformNode("mainGroup");

    // === МАТЕРИАЛЫ ===
    
    const tireMat = new BABYLON.StandardMaterial("tire", scene);
    tireMat.diffuseColor = new BABYLON.Color3(0.07, 0.07, 0.07);
    tireMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    tireMat.roughness = 0.95;
    
    const rimMat = new BABYLON.StandardMaterial("rim", scene);
    rimMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);
    rimMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    rimMat.specularPower = 96;
    
    const spokeMat = new BABYLON.StandardMaterial("spoke", scene);
    spokeMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
    spokeMat.specularColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    spokeMat.specularPower = 128;
    
    const hubMat = new BABYLON.StandardMaterial("hub", scene);
    hubMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);
    hubMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    hubMat.specularPower = 64;
    
    const discMat = new BABYLON.StandardMaterial("disc", scene);
    discMat.diffuseColor = new BABYLON.Color3(0.55, 0.55, 0.55);
    discMat.specularColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    discMat.specularPower = 128;
    
    const caliperRedMat = new BABYLON.StandardMaterial("caliperRed", scene);
    caliperRedMat.diffuseColor = new BABYLON.Color3(0.95, 0.1, 0.1);
    caliperRedMat.specularColor = new BABYLON.Color3(1, 0.4, 0.4);
    caliperRedMat.specularPower = 96;
    caliperRedMat.emissiveColor = new BABYLON.Color3(0.1, 0, 0);
    
    const caliperGoldMat = new BABYLON.StandardMaterial("caliperGold", scene);
    caliperGoldMat.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.15);
    caliperGoldMat.specularColor = new BABYLON.Color3(1, 0.85, 0.3);
    caliperGoldMat.specularPower = 128;
    
    const boltMat = new BABYLON.StandardMaterial("bolt", scene);
    boltMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    boltMat.specularColor = new BABYLON.Color3(1, 1, 1);
    boltMat.specularPower = 256;
    
    const bracketMat = new BABYLON.StandardMaterial("bracket", scene);
    bracketMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    bracketMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    bracketMat.roughness = 0.7;

    // === КОЛЕСО (БЕЗ ПОВОРОТА, ШИНА В ПЛОСКОСТИ XY) ===
    const wheelGroup = new BABYLON.TransformNode("wheelGroup");
    wheelGroup.parent = mainGroup;

  
    // Шина
    const tire = BABYLON.MeshBuilder.CreateTorus("tire", {
        diameter: 2.0,
        thickness: 0.28
    }, scene);
    tire.material = tireMat;
    tire.position = new BABYLON.Vector3(0, 0, 0);
    tire.rotation.x = Math.PI / 2; // Поворот на 90° вокруг оси X
    tire.parent = wheelGroup;
    
    // Протектор
    for (let i = 0; i < 16; i++) {
        const angle = (i * 22.5) * Math.PI / 180;
        const tread = BABYLON.MeshBuilder.CreateBox("tread" + i, {
            width: 0.03,
            height: 0.05,
            depth: 0.1
        }, scene);
        tread.material = tireMat;
        tread.position = new BABYLON.Vector3(
            Math.cos(angle) * 1.0,
            Math.sin(angle) * 1.0,
            0
        );
        tread.rotation.z = angle;
        tread.parent = wheelGroup;
    }
    
    // Обод
    const rim = BABYLON.MeshBuilder.CreateCylinder("rim", {
        diameter: 1.4,
        height: 0.22
    }, scene);
    rim.material = rimMat;
    rim.rotation.x = Math.PI / 2;
    rim.position = new BABYLON.Vector3(0, 0, 0);
    rim.parent = wheelGroup;
    
    // Красная полоса на ободе
    const rimStripe = BABYLON.MeshBuilder.CreateTorus("rimStripe", {
        diameter: 2.3,
        thickness: 0.025
    }, scene);
    rimStripe.material = caliperRedMat;
    rimStripe.rotation.x = Math.PI / 2;
    rimStripe.position = new BABYLON.Vector3(0, 0, 0);
    rimStripe.parent = wheelGroup;


    
    // 6 основных спиц 
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        
      
        const spoke = BABYLON.MeshBuilder.CreateBox("spoke" + i, {
            width: 1.0,
            height: 0.06,
            depth: 0.02
        }, scene);
        spoke.material = spokeMat;
        
        spoke.position = new BABYLON.Vector3(
            Math.cos(angle) * 0.6,
            Math.sin(angle) * 0.6,
            0
        );
        
        spoke.rotation.z = angle;
        spoke.rotation.y = 0;
        spoke.rotation.x = 0;
        
        spoke.parent = wheelGroup;
    }
    
    // 6 спиц 
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 + 30) * Math.PI / 180;
        
        const spoke = BABYLON.MeshBuilder.CreateBox("spokeFront" + i, {
            width: 0.95,
            height: 0.05,
            depth: 0.015
        }, scene);
        spoke.material = spokeMat;
        
        spoke.position = new BABYLON.Vector3(
            Math.cos(angle) * 0.55,
            Math.sin(angle) * 0.55,
            0.06
        );
        
        spoke.rotation.z = angle;
        
        spoke.parent = wheelGroup;
    }
    
    // 6 спиц со смещением 
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60 + 30) * Math.PI / 180;
        
        const spoke = BABYLON.MeshBuilder.CreateBox("spokeBack" + i, {
            width: 0.95,
            height: 0.05,
            depth: 0.015
        }, scene);
        spoke.material = spokeMat;
        
        spoke.position = new BABYLON.Vector3(
            Math.cos(angle) * 0.55,
            Math.sin(angle) * 0.55,
            -0.06
        );
        
        spoke.rotation.z = angle;
        
        spoke.parent = wheelGroup;
    }
    

    
    // Ось (вдоль Z)
    const axle = BABYLON.MeshBuilder.CreateCylinder("axle", {
        diameter: 0.08,
        height: 0.7
    }, scene);
    axle.material = spokeMat;
    axle.rotation.x = Math.PI / 2;
    axle.position = new BABYLON.Vector3(0, 0, 0);
    axle.parent = wheelGroup;
    
    // Гайки оси
    const axleNut1 = BABYLON.MeshBuilder.CreateCylinder("axleNut1", {
        diameter: 0.14,
        height: 0.06
    }, scene);
    axleNut1.material = boltMat;
    axleNut1.rotation.x = Math.PI / 2;
    axleNut1.position = new BABYLON.Vector3(0, 0, 0.32);
    axleNut1.parent = wheelGroup;
    
    const axleNut2 = axleNut1.clone("axleNut2");
    axleNut2.position = new BABYLON.Vector3(0, 0, -0.32);
    axleNut2.parent = wheelGroup;

    // === ТОРМОЗНОЙ ДИСК 1 ===
    const discGroup1 = new BABYLON.TransformNode("discGroup1");
    discGroup1.parent = wheelGroup;
    discGroup1.position = new BABYLON.Vector3(0, 0, 0.18);
    
    const disc1 = BABYLON.MeshBuilder.CreateCylinder("disc1", {
        diameter: 1.1,
        height: 0.04
    }, scene);
    disc1.material = discMat;
    disc1.rotation.x = Math.PI / 2;
    disc1.position = new BABYLON.Vector3(0, 0, 0);
    disc1.parent = discGroup1;
    
    // Перфорация диска 1
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const hole = BABYLON.MeshBuilder.CreateCylinder("hole1_" + i, {
            diameter: 0.06,
            height: 0.05
        }, scene);
        const holeMat = new BABYLON.StandardMaterial("holeMat", scene);
        holeMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        hole.material = holeMat;
        hole.rotation.x = Math.PI / 2;
        hole.position = new BABYLON.Vector3(
            Math.cos(angle) * 0.4,
            Math.sin(angle) * 0.4,
            0
        );
        hole.parent = discGroup1;
    }



    // === ФУНКЦИЯ СОЗДАНИЯ СУППОРТА ===
    function createCaliper(name, colorMat, angleDeg, posZ, side) {
        const caliperGroup = new BABYLON.TransformNode(name);
        caliperGroup.parent = wheelGroup;
        
        const angle = angleDeg * Math.PI / 180;
        const radius = 0.5;
        const posX = Math.cos(angle) * radius;
        const posY = Math.sin(angle) * radius;
        
        // Кронштейн
        const bracket = BABYLON.MeshBuilder.CreateBox("bracket_" + name, {
            width: 0.2,
            height: 0.15,
            depth: 0.25
        }, scene);
        bracket.material = bracketMat;
        bracket.position = new BABYLON.Vector3(posX, posY, posZ);
        bracket.rotation.z = angle;
        bracket.parent = caliperGroup;
        
        // Корпус суппорта
        const body = BABYLON.MeshBuilder.CreateBox("body_" + name, {
            width: 0.3,
            height: 0.18,
            depth: 0.2
        }, scene);
        body.material = colorMat;
        body.position = new BABYLON.Vector3(
            posX + Math.cos(angle) * 0.08,
            posY + Math.sin(angle) * 0.08,
            posZ
        );
        body.rotation.z = angle;
        body.parent = caliperGroup;
        
        // Верхняя часть суппорта
        const topPart = BABYLON.MeshBuilder.CreateBox("top_" + name, {
            width: 0.22,
            height: 0.1,
            depth: 0.16
        }, scene);
        topPart.material = colorMat;
        topPart.position = new BABYLON.Vector3(
            posX + Math.cos(angle) * 0.14,
            posY + Math.sin(angle) * 0.14,
            posZ
        );
        topPart.rotation.z = angle;
        topPart.parent = caliperGroup;
        
        
        return caliperGroup;
    }

    // === СОЗДАЁМ СУППОРТА ===
    
    // Красный суппорт - сверху (90°)
    createCaliper("caliperTop", caliperRedMat, 90, 0.12, "top");
    
    // Золотой суппорт - снизу (270°)
    createCaliper("caliperBottom", caliperGoldMat, 0, 0.22, "bottom");
    
    // Дополнительный малый суппорт - справа (0°)
    const auxGroup = new BABYLON.TransformNode("auxCaliper");
    auxGroup.parent = wheelGroup;
    
    const auxAngle = 0 * Math.PI / 180;
    const auxRadius = 0.45;
    const auxPosX = Math.cos(auxAngle) * auxRadius;
    const auxPosY = Math.sin(auxAngle) * auxRadius;
    
    const auxBody = BABYLON.MeshBuilder.CreateBox("auxBody", {
        width: 0.22,
        height: 0.01,
        depth: 0.18
    }, scene);
   
    
    const auxHose = BABYLON.MeshBuilder.CreateCylinder("auxHose", {
        diameter: 0.01,
        height: 0.01
    }, scene);
    const auxHoseMat = new BABYLON.StandardMaterial("auxHoseMat", scene);
    auxHoseMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    auxHose.material = auxHoseMat;
    auxHose.rotation.x = Math.PI / 2;
    auxHose.rotation.z = auxAngle - 0.3;
    auxHose.position = new BABYLON.Vector3(auxPosX + 0.1, auxPosY - 0.05, -0.22);
    auxHose.parent = auxGroup;



    // === ЗЕРКАЛЬНЫЙ ПОЛ ===
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 7,
        height: 7
    }, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.04, 0.04, 0.06);
    groundMaterial.specularColor = new BABYLON.Color3(0.25, 0.25, 0.3);
    groundMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
    groundMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
    groundMaterial.reflectionTexture.renderList = scene.meshes.filter(m => m !== ground);
    groundMaterial.reflectionTexture.level = 0.3;
    ground.material = groundMaterial;
    ground.position.y = -0.55;
    ground.position.z = 0;

    // === АНИМАЦИЯ ===
    scene.registerBeforeRender(() => {
        mainGroup.rotation.y += 0.004;
    });

    // === ЗАПУСК ===
    engine.runRenderLoop(() => { 
        scene.render(); 
    });
    
    window.addEventListener('resize', () => { 
        engine.resize(); 
    });
    
    console.log('✅ Wheel with rotated spokes created! Meshes:', scene.meshes.length);
}

// ============================================
// === ГАЛЕРЕЯ С ПРОКРУТКОЙ (ПОЛНОСТЬЮ СОХРАНЕНА) ===
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing gallery...');
    
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (!slider || !slides.length || !prevBtn || !nextBtn) {
        console.warn('⚠️ Gallery elements not found');
        return;
    }
    
    let currentIndex = 0;
    let autoSlideInterval;

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.display = index === currentIndex ? 'block' : 'none';
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    updateSlider();
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    startAutoSlide();
    
    slider.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.parentElement.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    console.log('✅ Gallery initialized');
});

// === ПЛАВНЫЙ СКРОЛЛ ===
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

console.log('=== StuntRiding site loaded with Only Spokes Rotated ===');