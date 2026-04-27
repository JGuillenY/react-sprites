import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { SpriteResource, SpriteManagerContextType } from "./types";

const SpriteManagerContext = createContext<SpriteManagerContextType | undefined>(undefined);

/**
 * Sprite Manager Provider Component
 * 
 * Fixed version: Uses refs for loading state to avoid infinite re-renders
 */
export function SpriteManagerProvider({ children }: { children: ReactNode }) {
  // Only store LOADED resources in state (not loading resources)
  const [loadedResources, setLoadedResources] = useState<Record<string, SpriteResource>>({});
  
  // Use refs for everything else to avoid re-renders
  const loadingPromisesRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  const loadingResourcesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const errorResourcesRef = useRef<Map<string, Error>>(new Map());
  
  // Ref to track loaded resources (for loadSprite to avoid dependency on state)
  const loadedResourcesRef = useRef(loadedResources);
  
  // Update the ref when state changes and clean up loading resources
  useEffect(() => {
    loadedResourcesRef.current = loadedResources;
    
    // Clean up loadingResourcesRef - remove any that are now in loadedResources
    for (const [src] of loadingResourcesRef.current) {
      if (loadedResources[src]?.loaded) {
        loadingResourcesRef.current.delete(src);
      }
    }
  }, [loadedResources]);

  /**
   * Load a single sprite resource
   */
  const loadSprite = useCallback((src: string): Promise<HTMLImageElement> => {
    // Check if already loading
    const existingPromise = loadingPromisesRef.current.get(src);
    if (existingPromise) {
      return existingPromise;
    }

    // Check if already loaded (using ref to avoid dependency)
    const loadedResource = loadedResourcesRef.current[src];
    if (loadedResource?.loaded) {
      return Promise.resolve(loadedResource.image);
    }
    
    // Check if already errored
    const error = errorResourcesRef.current.get(src);
    if (error) {
      return Promise.reject(error);
    }

    // Check if currently loading (image element exists but promise was already settled)
    const loadingImage = loadingResourcesRef.current.get(src);
    if (loadingImage) {
      if (loadingImage.complete) {
        return Promise.resolve(loadingImage);
      }
      return new Promise<HTMLImageElement>((resolve, reject) => {
        loadingImage.addEventListener('load', () => resolve(loadingImage), { once: true });
        loadingImage.addEventListener('error', () => reject(new Error(`Failed to load sprite: ${src}`)), { once: true });
      });
    }

    // Create new promise
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      
      // Store in loading ref immediately
      loadingResourcesRef.current.set(src, image);
      
      image.onload = () => {
        // Update state with loaded resource (triggers re-render)
        setLoadedResources(prev => ({
          ...prev,
          [src]: {
            image,
            loaded: true,
          },
        }));
        
        // Clean up refs (but keep in loadingResourcesRef as fallback until state updates)
        loadingPromisesRef.current.delete(src);
        errorResourcesRef.current.delete(src);
        // DON'T delete from loadingResourcesRef yet - keep as fallback
        
        resolve(image);
      };

      image.onerror = () => {
        const error = new Error(`Failed to load sprite: ${src}`);
        
        // Store error in ref
        errorResourcesRef.current.set(src, error);
        
        // Clean up refs
        loadingPromisesRef.current.delete(src);
        loadingResourcesRef.current.delete(src);
        
        reject(error);
      };

      // Start loading
      image.src = src;
    });

    // Store the promise
    loadingPromisesRef.current.set(src, promise);
    
    return promise;
  }, []); // No dependencies - uses refs for everything

  /**
   * Preload a sprite resource
   */
  const preloadResource = useCallback(async (src: string): Promise<void> => {
    // Just call loadSprite and ignore the result
    await loadSprite(src);
  }, [loadSprite]); // loadSprite has empty deps, so this is stable

  /**
   * Get a sprite resource by source URL
   */
  const getResource = useCallback((src: string): SpriteResource | undefined => {
    // Check loaded resources first
    const loadedResource = loadedResources[src];
    if (loadedResource) {
      return loadedResource;
    }
    
    // Check if loading
    const loadingImage = loadingResourcesRef.current.get(src);
    if (loadingImage) {
      return {
        image: loadingImage,
        loaded: false,
      };
    }
    
    // Check if errored
    const error = errorResourcesRef.current.get(src);
    if (error) {
      return {
        image: new Image(), // Dummy image
        loaded: false,
        error,
      };
    }
    
    return undefined;
  }, [loadedResources]);

  /**
   * Check if a resource is loaded
   */
  const isResourceLoaded = useCallback((src: string): boolean => {
    return loadedResources[src]?.loaded || false;
  }, [loadedResources]);

  /**
   * Clear all cached resources
   */
  const clearCache = useCallback(() => {
    setLoadedResources({});
    loadingPromisesRef.current.clear();
    loadingResourcesRef.current.clear();
    errorResourcesRef.current.clear();
  }, []);

  /**
   * Remove a specific resource from cache
   */
  const removeResource = useCallback((src: string) => {
    setLoadedResources(prev => {
      const newResources = { ...prev };
      delete newResources[src];
      return newResources;
    });
    loadingPromisesRef.current.delete(src);
    loadingResourcesRef.current.delete(src);
    errorResourcesRef.current.delete(src);
  }, []);

  /**
   * Get statistics about resource usage
   */
  const getStats = useCallback(() => {
    const loaded = Object.values(loadedResources);
    const loading = Array.from(loadingResourcesRef.current.values());
    const errors = Array.from(errorResourcesRef.current.values());
    
    return {
      total: loaded.length + loading.length + errors.length,
      loaded: loaded.length,
      loading: loading.length,
      errors: errors.length,
    };
  }, [loadedResources]);

  const contextValue: SpriteManagerContextType = {
    getResource,
    preloadResource,
    isResourceLoaded,
    clearCache,
    removeResource,
    getStats,
  };

  return (
    <SpriteManagerContext.Provider value={contextValue}>
      {children}
    </SpriteManagerContext.Provider>
  );
}

/**
 * Hook to use the Sprite Manager
 */
export function useSpriteManager(): SpriteManagerContextType {
  const context = useContext(SpriteManagerContext);
  if (context === undefined) {
    throw new Error("useSpriteManager must be used within a SpriteManagerProvider");
  }
  return context;
}

/**
 * Hook to preload multiple sprite resources
 */
export function usePreloadSprites(sources: string[]): {
  loading: boolean;
  error: Error | null;
  progress: number;
} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const { preloadResource } = useSpriteManager();

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      if (sources.length === 0) {
        setLoading(false);
        setProgress(100);
        return;
      }

      let completed = 0;

      try {
        await Promise.all(
          sources.map(async src => {
            await preloadResource(src);
            if (isMounted) {
              completed++;
              setProgress(Math.round((completed / sources.length) * 100));
            }
          })
        );

        if (isMounted) setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to preload sprites"));
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [sources, preloadResource]);

  return { loading, error, progress };
}