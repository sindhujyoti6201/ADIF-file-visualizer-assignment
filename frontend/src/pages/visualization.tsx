import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import Navbar from '../components/Navbar';

// Individual model components with proper scaling and positioning
function BrainModel() {
  const { scene } = useGLTF('/models/human-body/brain.glb');
  return <primitive object={scene} scale={[0.08, 0.08, 0.08]} position={[0, 0, 0]} />;
}

function HeartModel() {
  const { scene } = useGLTF('/models/human-body/heart.glb');
  return <primitive object={scene} scale={[5, 5, 5]} position={[0, -0.3, 0]} />;
}

function LungsModel() {
  const { scene } = useGLTF('/models/human-body/lungs.glb');
  return <primitive object={scene} scale={[5, 5, 5]} position={[0, -0.3, 0]} />;
}

function SpineModel() {
  const { scene } = useGLTF('/models/human-body/spine.glb');
  return <primitive object={scene} scale={[1.5, 1.5, 1.5]} position={[0, -0.3, 0]} />;
}



function DigestiveSystemModel() {
  const { scene } = useGLTF('/models/human-body/digestivesystem.glb');
  return <primitive object={scene} scale={[1.5, 1.5, 1.5]} position={[0, -0.3, 0]} />;
}

// Preload all models
useGLTF.preload('/models/human-body/brain.glb');
useGLTF.preload('/models/human-body/heart.glb');
useGLTF.preload('/models/human-body/lungs.glb');
useGLTF.preload('/models/human-body/spine.glb');
useGLTF.preload('/models/human-body/digestivesystem.glb');

interface ModelSection {
  name: string;
  description: string;
  component: React.ComponentType;
  cameraPosition: [number, number, number];
}

export default function Visualization() {
  const [activeModel, setActiveModel] = useState('Brain');

  const sections: ModelSection[] = [
    {
      name: 'Brain',
      description: 'The command center of the human nervous system, responsible for processing information, controlling movement, and regulating vital functions.',
      component: BrainModel,
      cameraPosition: [0, 0, 3.5]
    },
    {
      name: 'Heart',
      description: 'The muscular organ that pumps blood throughout the circulatory system, delivering oxygen and nutrients to all parts of the body.',
      component: HeartModel,
      cameraPosition: [0, 0, 2]
    },
    {
      name: 'Lungs',
      description: 'The primary organs of respiration, responsible for oxygenating blood and removing carbon dioxide from the body.',
      component: LungsModel,
      cameraPosition: [0, 0, 3.5]
    },
    {
      name: 'Spine',
      description: 'The flexible column of bones that provides structural support and protects the spinal cord, enabling movement and stability.',
      component: SpineModel,
      cameraPosition: [0, 0, 4]
    },
    
    {
      name: 'Digestive System',
      description: 'The complex network of organs responsible for breaking down food, absorbing nutrients, and eliminating waste.',
      component: DigestiveSystemModel,
      cameraPosition: [0, 0, 3]
    }
  ];

  const currentSection = sections.find(section => section.name === activeModel) || sections[0];
  const Component = currentSection.component;

  return (
    <div>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
      <Navbar />
      
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        position: 'relative',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        paddingTop: '80px', // Add padding to account for fixed navbar
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: '#3b82f6',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0,
          }}>
            3D Visualization of Human Body Parts
          </h1>
        </div>
        
        {/* Model Selection Buttons */}
        <div style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          background: '#3b82f6',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}>
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => setActiveModel(section.name)}
              style={{
                padding: '1rem 2rem',
                background: activeModel === section.name ? '#1e40af' : '#ffffff',
                color: activeModel === section.name ? '#ffffff' : '#3b82f6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeModel === section.name ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={(e) => {
                if (activeModel !== section.name) {
                  e.currentTarget.style.background = '#dbeafe';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeModel !== section.name) {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {section.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '3rem',
            maxWidth: '800px',
          }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#1a1a2e',
              letterSpacing: '-0.02em',
            }}>
              {currentSection.name}
            </h2>
            <p style={{ 
              fontSize: '1.3rem',
              opacity: 0.8,
              lineHeight: '1.7',
              fontWeight: '400',
              color: '#495057',
            }}>
              {currentSection.description}
            </p>
          </div>
          
          {/* 3D Canvas */}
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            height: '60vh',
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            border: '2px solid #dee2e6',
            background: '#6b7280',
          }}>
            <Canvas
              camera={{ position: currentSection.cameraPosition, fov: 60 }}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
              }}
            >
              <PerspectiveCamera makeDefault position={currentSection.cameraPosition} />
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} />
              <pointLight position={[-10, -10, -5]} intensity={0.8} />
              <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
              
              <Suspense fallback={
                <mesh>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="#6c757d" />
                </mesh>
              }>
                <Component />
              </Suspense>
              
              <Environment preset="studio" />
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={false}
                minDistance={0.5}
                maxDistance={20}
                dampingFactor={0.05}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
} 