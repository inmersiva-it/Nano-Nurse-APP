import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

type Patient = {
  id: string;
  name: string;
  diagnosis: string;
  status: string;
  note: string;
};

@Component({
  selector: 'app-simulation-room',
  standalone: true,
  templateUrl: './simulation-room.html',
  styleUrls: ['./simulation-room.css'],
})
export class SimulationRoom implements AfterViewInit, OnDestroy {
  @Input() patient: Patient | null = null;
  @Input() state: 'idle' | 'running' | 'done' = 'idle';
  @Input() progress = 0;
  @Output() inject = new EventEmitter<void>();

  @ViewChild('canvasContainer', { static: false }) canvasContainer?: ElementRef<HTMLDivElement>;

  statusText = 'Sistema en espera...';
  buttonLabel = 'Iniciar Protocolo de Nanobots';
  isInjecting = false;

  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private heartModel?: THREE.Object3D;
  private animationId: number | null = null;
  private rotationSpeed = 0.002;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThreeScene();
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    window.removeEventListener('resize', this.onWindowResize);
    this.disposeRenderer();
  }

  startProtocol(): void {
    if (this.isInjecting) {
      return;
    }
    this.isInjecting = true;
    this.statusText = 'Inyectando nanobots... Estabilizando ritmo cardíaco.';
    this.inject.emit();
  }

  private initThreeScene(): void {
    if (!this.canvasContainer) {
      return;
    }

    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#E3F2FD');

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 3.2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1.5, 2.5, 2);
    directionalLight.castShadow = true;

    const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x404060, 0.6);

    this.scene.add(ambientLight, directionalLight, hemisphereLight);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(new THREE.Color('#E3F2FD'), 1);
    this.renderer.domElement.style.display = 'block';

    container.appendChild(this.renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      'assets/human_heart_3d_model_fbx_gltf.glb',
      (gltf) => {
        this.heartModel = gltf.scene;
        this.heartModel.rotation.set(0, Math.PI * 0.15, 0);
        this.heartModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(this.heartModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        this.heartModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fitOffset = 1.3;
        const distance = maxDim / (2 * Math.tan((Math.PI * this.camera!.fov) / 360)) * fitOffset;
        this.camera!.position.set(0, size.y * 0.25, distance);
        this.camera!.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera!.updateProjectionMatrix();

        this.scene?.add(this.heartModel);
      },
      undefined,
      (error) => {
        console.error('Error cargando el modelo 3D:', error);
      }
    );

    window.addEventListener('resize', this.onWindowResize);
  }

  private animate = (): void => {
    if (!this.renderer || !this.scene || !this.camera) {
      return;
    }

    if (this.heartModel) {
      const speed = this.isInjecting ? this.rotationSpeed * 3.5 : this.rotationSpeed;
      this.heartModel.rotation.y += speed;
      this.heartModel.rotation.x = Math.sin(Date.now() * 0.0004) * 0.03;
    }

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate);
  };

  private onWindowResize = (): void => {
    if (!this.canvasContainer || !this.camera || !this.renderer) {
      return;
    }

    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private disposeRenderer(): void {
    if (this.renderer) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = undefined;
    }
  }
}
