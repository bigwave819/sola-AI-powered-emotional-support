import { View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { GlassSurface } from '@/src/components/ui/GlassSurface';
import { useQueryClient } from '@tanstack/react-query';

export default function Paywall() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    Purchases.getOfferings().then((offerings) => {
      if (offerings.current) setPackages(offerings.current.availablePackages);
      setLoading(false);
    });
  }, []);

  async function purchase(pkg: PurchasesPackage) {
    try {
      await Purchases.purchasePackage(pkg);
      queryClient.invalidateQueries({ queryKey: ['entitlement'] });
      router.back();
    } catch (err: any) {
      if (!err.userCancelled) console.error('Purchase failed', err);
    }
  }

  async function restore() {
    await Purchases.restorePurchases();
    queryClient.invalidateQueries({ queryKey: ['entitlement'] });
    router.back();
  }

  return (
    <ScrollView className="flex-1 bg-background p-6" contentContainerClassName="gap-4">
      <GlassSurface intensity="medium">
        <Text variant="headline">Sola Plus</Text>
        <Text variant="body" className="mt-2 text-text-secondary">
          High-limit AI reflection, deeper insights, and more — completely ad-free.
        </Text>
      </GlassSurface>

      {loading ? (
        <Text variant="body">Loading plans...</Text>
      ) : (
        packages.map((pkg) => (
          <Button
            key={pkg.identifier}
            label={`${pkg.product.title} — ${pkg.product.priceString}`}
            onPress={() => purchase(pkg)}
          />
        ))
      )}

      <Button label="Restore purchases" variant="secondary" onPress={restore} />
      <Button label="Not now" variant="secondary" onPress={() => router.back()} />
    </ScrollView>
  );
}