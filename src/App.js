import React, { useRef, useState, forwardRef } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import gsap from 'gsap';

const Marker = ({ position, label, isHovered, isSelected }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial
          color={isSelected ? 'red' : isHovered ? 'red' : 'transparent'}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={isSelected || isHovered ? 1 : 0}
        />
      </mesh>

      {isSelected && (
        <Html position={[0, 0.15, 0]} distanceFactor={5}>
          <div
            style={{
              fontSize: '22px',
              backgroundColor: 'white',
              padding: '10px 15px',
              borderRadius: '5px',
              border: '1px solid black',
              textAlign: 'center',
              pointerEvents: 'none',
              transform: 'translate(-50%, -100%)',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

const FloorplanWithMarkers = forwardRef(({ objectFiles, markers, selectedRoom }, ref) => {
  const mtl = useLoader(MTLLoader, objectFiles.mtl);
  const obj = useLoader(OBJLoader, objectFiles.obj, (loader) => {
    mtl.preload();
    loader.setMaterials(mtl);
  });

  const [hovered, setHovered] = useState(null);

  return (
    <group ref={ref} position={[0, 0, -1]}>
      <primitive 
        object={obj} 
        scale={0.1} 
      />

      {markers.map((marker, index) => (
        <React.Fragment key={index}>
          <Marker
            position={marker.position}
            label={marker.label}
            isHovered={hovered === index}
            isSelected={selectedRoom === marker.label}
            onPointerOver={() => setHovered(index)}
            onPointerOut={() => setHovered(null)}
          />

          {selectedRoom !== marker.label && (
            <Text
              position={[marker.position.x, marker.position.y, 0.02]}
              rotation={[0, 0, 0]}
              fontSize={0.05}
              color="black"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.09}
              outlineWidth={0.01}
              outlineColor="white"
            >
              {marker.label}
            </Text>
          )}
        </React.Fragment>
      ))}
    </group>
  );
});

const CameraController = ({ onZoomIn, onZoomOut }) => {
  const { camera } = useThree();

  onZoomIn.current = () => {
    if (camera.position.z > 2) camera.position.z -= 1;
  };

  onZoomOut.current = () => {
    if (camera.position.z < 6) camera.position.z += 1;
  };

  return null;
};

function App() {
  const floorplanRef = useRef();
  const onZoomIn = useRef(null);
  const onZoomOut = useRef(null);

  const objectFilesOptions = {
    option1: {
      obj: '/Floorplan_1_withouttext/Floorplan_1_withouttext.obj',
      mtl: '/Floorplan_1_withouttext/Floorplan_1_withouttext.mtl',
      markers: [
        { label: 'A&E DEPT. OFFICE', position: new THREE.Vector3(3.0, -0.34, 0) },
        { label: 'A&E REGISTRATION', position: new THREE.Vector3(-1.45, 1.44, 0) },
        { label: 'AMBULANCE/POLICE', position: new THREE.Vector3(-2.8, 1.3, 0) },
        { label: 'AUTOMATED BANKING MACHINE', position: new THREE.Vector3(3.11, -3.36, 0) },
        { label: 'CHANGING ROOM (1)', position: new THREE.Vector3(0.94, 3.5, 0) },
        { label: 'CHANGING ROOM (2)', position: new THREE.Vector3(1.3, 2.0, 0) },
        { label: 'CLEANER ROOM', position: new THREE.Vector3(-0.56, 2.31, 0) },
        { label: 'CONSULTATION ROOM (1)', position: new THREE.Vector3(-0.05, 0.19, 0) },
        { label: 'CONSULTATION ROOM (2)', position: new THREE.Vector3(1.15, 0.32, 0) },
        { label: 'CU/STAFF BASE', position: new THREE.Vector3(1.0, -0.98, 0) },
        { label: 'D.O.A.', position: new THREE.Vector3(3.0, 1.92, 0) },
        { label: 'DARK ROOM', position: new THREE.Vector3(1.70, 2.8, 0) },
        { label: 'DIRTY UTILITY', position: new THREE.Vector3(0.1, -1.105, 0) },
        { label: 'DISPOSAL', position: new THREE.Vector3(1.15, 0.61, 0) },
        { label: 'DUTY ROOM', position: new THREE.Vector3(-1.08, 1.84, 0) },
        { label: 'ELECTRICITY', position: new THREE.Vector3(3.0, 0.68, 0) },
        { label: 'EMERGENCY MEDICINE (1)', position: new THREE.Vector3(0.42, -1.5, 0) },
        { label: 'EMERGENCY MEDICINE (2)', position: new THREE.Vector3(1.65, -1.5, 0) },
        { label: 'ENQUIRY OFFICE', position: new THREE.Vector3(1.81, -2.45, 0) },
        { label: 'EX. ROOM 1', position: new THREE.Vector3(-2.32, 3.5, 0) },
        { label: 'EX. ROOM 2', position: new THREE.Vector3(-1.85, 3.5, 0) },
        { label: 'EX. ROOM 3', position: new THREE.Vector3(-1.40, 3.5, 0) },
        { label: 'EX. ROOM 4', position: new THREE.Vector3(-0.9, 3.5, 0) },
        { label: 'EX. ROOM 5', position: new THREE.Vector3(-0.55, 3.5, 0) },
        { label: 'EX. ROOM 6', position: new THREE.Vector3(-0.22, 3.5, 0) },
        { label: 'EX. ROOM 7', position: new THREE.Vector3(0.12, 3.5, 0) },
        { label: 'EX. ROOM 12', position: new THREE.Vector3(0.48, 3.5, 0) },
        { label: 'FEMALE STAFF', position: new THREE.Vector3(1.22, -0.29, 0) },
        { label: 'FEMALE TOILET', position: new THREE.Vector3(-0.60, 1.18, 0) },
        { label: 'LIFT 1', position: new THREE.Vector3(3.0, 1.08, 0) },
        { label: 'LIFT 2', position: new THREE.Vector3(3.0, 1.42, 0) },
        { label: 'LIFT 3', position: new THREE.Vector3(3.05, 2.44, 0) },
        { label: 'LINEN ROOM', position: new THREE.Vector3(0.87, 3.74, 0) },
        { label: 'MALE STAFF', position: new THREE.Vector3(0.92, -0.29, 0) },
        { label: 'MALE TOILET', position: new THREE.Vector3(-0.1, 1.18, 0) },
        { label: 'MINOR OPERATION', position: new THREE.Vector3(-0.05, -0.44, 0) },
        { label: 'NURSING OFFICE', position: new THREE.Vector3(-1.08, 2.31, 0) },
        { label: 'PLANT ROOM', position: new THREE.Vector3(-3.1, 2.05, 0) },
        { label: 'PREP.', position: new THREE.Vector3(1.88, 0.61, 0) },
        { label: 'RADIOGRAPHER', position: new THREE.Vector3(0.89, 1.18, 0) },
        { label: 'RESUSCITATION ROOM (ESS)', position: new THREE.Vector3(1.60, 1.03, 0) },
        { label: 'RADIOLOGIST REPORT OFFICE', position: new THREE.Vector3(3.0, 0.13, 0) },
        { label: 'RESUSCITATION ROOM', position: new THREE.Vector3(-2.90, 3.0, 0) },
        { label: 'ROOM', position: new THREE.Vector3(1.15, 0.035, 0) },
        { label: 'STAFF BASE/CU', position: new THREE.Vector3(-1.65, 2.0, 0) },
        { label: 'STORE ROOM (1)', position: new THREE.Vector3(-0.70, 0.61, 0) },
        { label: 'STORE ROOM (2)', position: new THREE.Vector3(-0.07, 0.61, 0) },
        { label: 'STORE ROOM (3)', position: new THREE.Vector3(1.88, -0.0, 0) },
        { label: 'STORE ROOM (4)', position: new THREE.Vector3(-0.34, -1.105, 0) },
        { label: 'STORE ROOM (5)', position: new THREE.Vector3(-0.46, -1.615, 0) },
        { label: 'STORE ROOM (6)', position: new THREE.Vector3(1.98, -1.00, 0) },
        { label: 'TRAUMA SERVICE', position: new THREE.Vector3(3.0, -0.625, 0) },
        { label: 'TRIAGE STAT.', position: new THREE.Vector3(-1.95, 1.44, 0) },
        { label: 'WAITING AREA', position: new THREE.Vector3(-0.04, 2.31, 0) },
        { label: 'WAITING RM. NON-EMER, AMB, TRAN. SERV.', position: new THREE.Vector3(3.8, -0.045, 0) },
        { label: 'WALK-IN CLINIC', position: new THREE.Vector3(-0.35, 1.84, 0) },
        { label: 'X-RAY RECEPTION OFFICE', position: new THREE.Vector3(0.85, 1.83, 0) },
        { label: 'X-RAY ROOM (1)', position: new THREE.Vector3(1.70, 3.5, 0) },
        { label: 'X-RAY ROOM (2)', position: new THREE.Vector3(1.92, 2.04, 0) }
      ],
    },
    option2: {
      obj: '/Floorplan_2_withouttext/Floorplan_2_withouttext.obj',
      mtl: '/Floorplan_2_withouttext/Floorplan_2_withouttext.mtl',
      markers: [],
    },
  };

  // which plan to show first, but must align which the option list's order
  const [selectedObjectFiles, setSelectedObjectFiles] = useState(objectFilesOptions.option1); 
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleObjectFilesChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedObjectFiles(objectFilesOptions[selectedOption]);
    setSelectedRoom(''); // Reset selected room when switching object files
  };

  const handleRoomSelect = (event) => {
    const selectedLabel = event.target.value;
    setSelectedRoom(selectedLabel);
    const marker = selectedObjectFiles.markers.find((m) => m.label === selectedLabel);
    if (marker) {
      moveFloorplanToMarker(marker.position);
    }
  };

  const moveFloorplanToMarker = (markerPosition) => {
    gsap.to(floorplanRef.current.position, {
      x: -markerPosition.x,
      y: -markerPosition.y,
      z: -1,
      duration: 1,
    });
  };

  return (
    <div style={{ height: '85vh', width: '90vw', padding: '10vh 5vw' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '8vh',
          width: '100%',
          backgroundColor: '#0D0D0D',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <select
          onChange={handleObjectFilesChange}
          style={{
            width: '250px',
            padding: '10px',
            fontSize: '14px',
            backgroundColor: 'lightgrey',
            border: '1px solid black',
            borderRadius: '5px',
            color: 'black',
            cursor: 'pointer',
          }}
        >
          <option value="option1">G/F GROUND FLOOR BLOCK J</option>
          <option value="option2">2/F SECOND FLOOR</option>
        </select>

        <select
          onChange={handleRoomSelect}
          value={selectedRoom}
          style={{
            width: '250px',
            padding: '10px',
            fontSize: '14px',
            backgroundColor: 'lightgrey',
            border: '1px solid black',
            borderRadius: '5px',
            color: 'black',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled >
            SELECT A ROOM
          </option>
          {selectedObjectFiles.markers.map((marker, index) => (
            <option key={index} value={marker.label}>
              {marker.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onZoomIn.current && onZoomIn.current()}
          style={{
            padding: '10px',
            fontSize: '14px',
            backgroundColor: 'lightgrey',
            border: '1px solid black',
            borderRadius: '5px',
            color: 'black',
            cursor: 'pointer',
          }}
        >
          +
        </button>
        <button
          onClick={() => onZoomOut.current && onZoomOut.current()}
          style={{
            padding: '10px',
            fontSize: '14px',
            backgroundColor: 'lightgrey',
            border: '1px solid black',
            borderRadius: '5px',
            color: 'black',
            cursor: 'pointer',
          }}
        >
          -
        </button>
      </div>

      <Canvas
        style={{ position: 'relative', zIndex: 1 }}
        gl={{
          toneMapping: THREE.NoToneMapping,
        }}
        shadows={false}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={10} color="white" castShadow={false} />
        <pointLight position={[10, 10, 10]} />
        <FloorplanWithMarkers
          ref={floorplanRef}
          objectFiles={selectedObjectFiles}
          markers={selectedObjectFiles.markers}
          selectedRoom={selectedRoom}
        />
        <CameraController onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

export default App;
