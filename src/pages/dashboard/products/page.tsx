import { useEffect, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { products as mockProducts, type Product } from '@/mocks/settings';
import { suppliers as mockSuppliers, terminals as mockTerminals, type Supplier, type Terminal } from '@/mocks/sourcing';
import { createProduct, deleteProduct, fetchProducts, fetchSuppliers, fetchTerminals, updateProduct } from '@/mocks/schedule';

function terminalCount(productName: string, terminals: Terminal[]) {
  return terminals.filter((terminal) => terminal.products.includes(productName)).length;
}

function supplierCount(productName: string, suppliers: Supplier[]) {
  return suppliers.filter((supplier) => supplier.products.includes(productName)).length;
}

function productStatus(active: boolean) {
  return active
    ? 'bg-accent-100 text-accent-700'
    : 'bg-background-200 text-foreground-500';
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);

  useEffect(() => {
    let active = true;

    Promise.allSettled([fetchProducts(), fetchTerminals(), fetchSuppliers()]).then(([productsResult, terminalsResult, suppliersResult]) => {
      if (!active) return;

      if (productsResult.status === 'fulfilled') setProducts(productsResult.value);
      else console.error('Failed to load products', productsResult.reason);

      if (terminalsResult.status === 'fulfilled') setTerminals(terminalsResult.value);
      else console.error('Failed to load terminals for products', terminalsResult.reason);

      if (suppliersResult.status === 'fulfilled') setSuppliers(suppliersResult.value);
      else console.error('Failed to load suppliers for products', suppliersResult.reason);
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleCreateProduct() {
    const name = window.prompt('Product name');
    if (!name) return;

    const category = window.prompt('Category', 'Fuel') ?? 'Fuel';
    const description = window.prompt('Description', '') ?? '';
    const defaultMargin = window.prompt('Default margin', '0%') ?? '0%';
    const product = await createProduct({ name, category, description, defaultMargin, active: true });
    setProducts((items) => [...items, product]);
  }

  async function handleEditProduct(product: Product) {
    const name = window.prompt('Product name', product.name);
    if (!name) return;

    const category = window.prompt('Category', product.category) ?? product.category;
    const description = window.prompt('Description', product.description) ?? product.description;
    const defaultMargin = window.prompt('Default margin', product.defaultMargin) ?? product.defaultMargin;
    const active = window.confirm('Should this product be active?');
    const updated = await updateProduct(product.id, { ...product, name, category, description, defaultMargin, active });
    setProducts((items) => items.map((item) => (item.id === product.id ? updated : item)));
  }

  async function handleDeleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    await deleteProduct(product.id);
    setProducts((items) => items.filter((item) => item.id !== product.id));
  }

  return (
    <ModuleShell
      title="Products"
      description="Fuel type products available for sourcing, dispatch, and delivery."
      icon="ri-drop-line"
    >
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-foreground-400">{products.length} fuel products</span>
          <button
            type="button"
            onClick={handleCreateProduct}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-add-line text-sm leading-none" />
            Add product
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Fuel Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Category</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Description</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminals</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Suppliers</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Default Margin</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-semibold text-foreground-900 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium text-foreground-700 bg-background-100 rounded-md px-2 py-1 whitespace-nowrap">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500">{product.description}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{terminalCount(product.name, terminals)}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{supplierCount(product.name, suppliers)}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{product.defaultMargin}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${productStatus(product.active)}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => handleEditProduct(product)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-100 hover:text-foreground-900" aria-label={`Edit ${product.name}`}>
                        <i className="ri-edit-line text-base leading-none" />
                      </button>
                      <button type="button" onClick={() => handleDeleteProduct(product)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`Delete ${product.name}`}>
                        <i className="ri-delete-bin-line text-base leading-none" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleShell>
  );
}
