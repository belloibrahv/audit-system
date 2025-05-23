export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Audit System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};