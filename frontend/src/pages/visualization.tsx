import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Navbar from '../components/Navbar';

// Individual model components
function BrainModel() {
  const { scene } = useGLTF('/models/human-body/brain.glb');
  return <primitive object={scene} />;
}

function HeartModel() {
  const { scene } = useGLTF('/models/human-body/heart.glb');
  return <primitive object={scene} />;
}

function LungsModel() {
  const { scene } = useGLTF('/models/human-body/lungs.glb');
  return <primitive object={scene} />;
}

function SpineModel() {
  const { scene } = useGLTF('/models/human-body/spine.glb');
  return <primitive object={scene} />;
}

function EyeModel() {
  const { scene } = useGLTF('/models/human-body/eye.glb');
  return <primitive object={scene} />;
}

function DigestiveSystemModel() {
  const { scene } = useGLTF('/models/human-body/digestivesystem.glb');
  return <primitive object={scene} />;
}

// Preload all models
useGLTF.preload('/models/human-body/brain.glb');
useGLTF.preload('/models/human-body/heart.glb');
useGLTF.preload('/models/human-body/lungs.glb');
useGLTF.preload('/models/human-body/spine.glb');
useGLTF.preload('/models/human-body/eye.glb');
useGLTF.preload('/models/human-body/digestivesystem.glb');

interface ModelSection {
  name: string;
  icon: string;
  description: string;
  component: React.ComponentType;
  color: string;
}

export default function Visualization() {
  const sections: ModelSection[] = [
    {
      name: 'Brain',
      icon: '🧠',
      description: 'Interactive 3D model of the human brain',
      component: BrainModel,
      color: '#8b5cf6'
    },
    {
      name: 'Heart',
      icon: '❤️',
      description: 'Detailed 3D visualization of the heart',
      component: HeartModel,
      color: '#ef4444'
    },
    {
      name: 'Lungs',
      icon: '🫁',
      description: '3D model of the respiratory system',
      component: LungsModel,
      color: '#06b6d4'
    },
    {
      name: 'Spine',
      icon: '🦴',
      description: 'Interactive spine and vertebral column',
      component: SpineModel,
      color: '#f59e0b'
    },
    {
      name: 'Eye',
      icon: '👁️',
      description: '3D visualization of the human eye',
      component: EyeModel,
      color: '#10b981'
    },
    {
      name: 'Digestive System',
      icon: '🫀',
      description: 'Complete digestive system model',
      component: DigestiveSystemModel,
      color: '#f97316'
    }
  ];

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        html {
          margin: 0;
          padding: 0;
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <Navbar />
        
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          width: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          {/* Header Section */}
          <div style={{
            padding: '3rem 2rem',
            color: 'white',
            textAlign: 'center',
            zIndex: 10,
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Human Body Visualization
            </h1>
            <p style={{ 
              fontSize: '1.2rem',
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}>
              Interactive 3D Models - Scroll to explore
            </p>
          </div>

          {/* Model Sections */}
          {sections.map((section, index) => {
            const Component = section.component;
            return (
              <div
                key={section.name}
                style={{
                  minHeight: '100vh',
                  width: '100%',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Section Header */}
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  marginBottom: '2rem',
                  zIndex: 10,
                }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                  }}>
                    {section.icon}
                  </div>
                  <h2 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {section.name}
                  </h2>
                  <p style={{ 
                    fontSize: '1.2rem',
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    {section.description}
                  </p>
                </div>
                
                {/* 3D Canvas */}
                <div style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: '60vh',
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  border: `3px solid ${section.color}`,
                  background: 'rgba(0, 0, 0, 0.1)',
                }}>
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} intensity={0.5} />
                    
                    <Suspense fallback={
                      <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color={section.color} />
                      </mesh>
                    }>
                      <Component />
                    </Suspense>
                    
                    <OrbitControls 
                      enablePan={true}
                      enableZoom={true}
                      enableRotate={true}
                      autoRotate={true}
                      autoRotateSpeed={0.5}
                    />
                  </Canvas>
                </div>

                {/* Section Number */}
                <div style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  background: section.color,
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
} 