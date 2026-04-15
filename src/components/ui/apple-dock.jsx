import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const appleDockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto flex h-[50px] w-max items-center justify-center gap-5 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-5 py-2 backdrop-blur-md shadow-2xl"
);

const AppleDock = React.forwardRef(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === AppleDockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification: disableMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(appleDockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  }
);
AppleDock.displayName = "AppleDock";

const AppleDockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  onClick,
  active,
  colorName = "sky",
  ...props
}) => {
  const ref = useRef(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const colorThemes = {
    sky: {
      active: "bg-sky-500/20 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]",
      dot: "bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
      hover: "hover:text-sky-300 hover:bg-sky-500/10",
      inactive: "text-sky-200/50"
    },
    blue: {
      active: "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
      hover: "hover:text-blue-300 hover:bg-blue-500/10",
      inactive: "text-blue-200/50"
    },
    emerald: {
      active: "bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
      hover: "hover:text-emerald-300 hover:bg-emerald-500/10",
      inactive: "text-emerald-200/50"
    },
    amber: {
      active: "bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
      hover: "hover:text-amber-300 hover:bg-amber-500/10",
      inactive: "text-amber-200/50"
    },
    rose: {
      active: "bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
      hover: "hover:text-rose-300 hover:bg-rose-500/10",
      inactive: "text-rose-200/50"
    }
  };

  const theme = colorThemes[colorName] || colorThemes.sky;

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, targetSize, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        "relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl transition-all duration-200",
        disableMagnification && "hover:bg-slate-700/50",
        active ? theme.active : `${theme.inactive} ${theme.hover}`,
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex bg-transparent w-full h-full items-center justify-center">
        {children}
      </div>
      {active && (
        <motion.div
          layoutId="dock-active-indicator"
          className={cn("absolute -bottom-1 w-1.5 h-1.5 rounded-full", theme.dot)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};
AppleDockIcon.displayName = "AppleDockIcon";

export { AppleDock, AppleDockIcon };
