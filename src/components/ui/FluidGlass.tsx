/* eslint-disable react/no-unknown-property */
"use client";

import * as THREE from 'three';
import { useRef, useState, useEffect, memo, ReactNode, Suspense, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import {
    useFBO,
    MeshTransmissionMaterial,
    Text,
    Float
} from '@react-three/drei';
import { easing } from 'maath';

type Mode = 'lens' | 'bar' | 'cube';

export interface NavItem {
    label: string;
    link: string;
}

type ModeProps = Record<string, unknown>;

interface FluidGlassProps {
    mode?: Mode;
    lensProps?: ModeProps;
    barProps?: ModeProps;
    cubeProps?: ModeProps;
}

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }: FluidGlassProps) {
    const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
    const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

    const {
        navItems = [
            { label: 'Home', link: '/' },
            { label: 'Experience', link: '/experience' },
            { label: 'Projects', link: '/projects' },
            { label: 'About', link: '/about' }
        ],
        ...modeProps
    } = (rawOverrides || {}) as any;

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
                <Suspense fallback={null}>
                    <NavItems items={navItems as NavItem[]} />
                    <Wrapper modeProps={modeProps}>
                        <BackgroundContent />
                    </Wrapper>
                </Suspense>
            </Canvas>
        </div>
    );
}

function BackgroundContent() {
    return (
        <group>
            <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[-5, 0, -5]}>
                    <sphereGeometry args={[3, 32, 32]} />
                    <meshBasicMaterial color="#20494b" />
                </mesh>
            </Float>
            <Float speed={4} rotationIntensity={1} floatIntensity={3}>
                <mesh position={[5, -2, -8]}>
                    <sphereGeometry args={[4, 32, 32]} />
                    <meshBasicMaterial color="#1a1a1a" />
                </mesh>
            </Float>
            <Float speed={6} rotationIntensity={3} floatIntensity={1}>
                <mesh position={[0, 2, -10]}>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
                </mesh>
            </Float>
        </group>
    );
}

type MeshProps = ThreeElements['mesh'];

interface ModeWrapperProps extends MeshProps {
    children?: ReactNode;
    geometry: THREE.BufferGeometry;
    lockToBottom?: boolean;
    followPointer?: boolean;
    modeProps?: ModeProps;
}

const ModeWrapper = memo(function ModeWrapper({
    children,
    geometry,
    lockToBottom = false,
    followPointer = true,
    modeProps = {},
    ...props
}: ModeWrapperProps) {
    const ref = useRef<THREE.Mesh>(null!);
    const buffer = useFBO();
    const { viewport: vp } = useThree();
    const [scene] = useState<THREE.Scene>(() => new THREE.Scene());

    const geoWidth = useMemo(() => {
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        return box.max.x - box.min.x || 1;
    }, [geometry]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        const { gl, viewport, pointer, camera } = state;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

        const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
        const destY = lockToBottom ? -v.height / 2 + 0.15 : followPointer ? (pointer.y * v.height) / 2 : 0;

        easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

        if ((modeProps as any).scale == null) {
            const maxWorld = v.width * 0.9;
            const desired = maxWorld / geoWidth;
            ref.current.scale.setScalar(Math.min(0.15, desired));
        }

        gl.setRenderTarget(buffer);
        gl.render(scene, camera);
        gl.setRenderTarget(null);
    });

    const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as any;

    return (
        <>
            {createPortal(children, scene)}
            <mesh
                ref={ref}
                scale={scale ?? 0.1}
                rotation-x={Math.PI / 2}
                geometry={geometry}
                {...props}
            >
                <MeshTransmissionMaterial
                    buffer={buffer.texture}
                    ior={ior ?? 1.15}
                    thickness={thickness ?? 2}
                    anisotropy={anisotropy ?? 0.1}
                    chromaticAberration={chromaticAberration ?? 0.05}
                    transmission={1}
                    roughness={0.1}
                    background={new THREE.Color('#000000')}
                    {...extraMat}
                />
            </mesh>
        </>
    );
});

function Lens({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
    const geo = useMemo(() => new THREE.CylinderGeometry(15, 15, 2, 64), []);
    return <ModeWrapper geometry={geo} followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: { modeProps?: ModeProps } & MeshProps) {
    const geo = useMemo(() => new THREE.BoxGeometry(20, 20, 20), []);
    return <ModeWrapper geometry={geo} followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: { modeProps?: ModeProps } & MeshProps) {
    const geo = useMemo(() => {
        // Sleek wide pill
        const g = new THREE.CapsuleGeometry(5, 70, 4, 16);
        g.rotateZ(Math.PI / 2);
        return g;
    }, []);

    const defaultMat = {
        transmission: 1,
        roughness: 0.1,
        thickness: 1.5,
        ior: 1.2,
        color: '#ffffff',
    };

    return (
        <ModeWrapper
            geometry={geo}
            lockToBottom
            followPointer={false}
            modeProps={{ ...defaultMat, ...modeProps }}
            {...p}
        />
    );
}

function NavItems({ items }: { items: NavItem[] }) {
    const group = useRef<THREE.Group>(null!);
    const { viewport, camera } = useThree();

    const DEVICE = {
        mobile: { max: 639, spacing: 0.2, fontSize: 0.04 },
        tablet: { max: 1023, spacing: 0.3, fontSize: 0.05 },
        desktop: { max: Infinity, spacing: 0.4, fontSize: 0.055 }
    };

    const getDevice = () => {
        if (typeof window === "undefined") return "desktop";
        const w = window.innerWidth;
        return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
    };

    const [device, setDevice] = useState<keyof typeof DEVICE>(getDevice());

    useEffect(() => {
        const onResize = () => setDevice(getDevice());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const { spacing, fontSize } = DEVICE[device];

    useFrame(() => {
        if (!group.current) return;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
        group.current.position.set(0, -v.height / 2 + 0.15, 15.2);

        group.current.children.forEach((child, i) => {
            child.position.x = (i - (items.length - 1) / 2) * spacing;
        });
    });

    const handleNavigate = (link: string) => {
        if (!link) return;
        if (typeof window !== "undefined") {
            window.location.href = link;
        }
    };

    return (
        <group ref={group} renderOrder={100}>
            {items.map(({ label, link }) => (
                <Text
                    key={label}
                    fontSize={fontSize}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(link);
                    }}
                    onPointerOver={() => (document.body.style.cursor = 'pointer')}
                    onPointerOut={() => (document.body.style.cursor = 'auto')}
                >
                    {label}
                </Text>
            ))}
        </group>
    );
}
