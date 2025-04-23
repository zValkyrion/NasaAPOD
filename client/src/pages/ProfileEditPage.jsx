import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaUserEdit, FaArrowLeft, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa'; // Import icons

// Custom Hooks & Components
import useAuth from '../hooks/useAuth'; // Hook for authentication context
import ProfileForm from '../components/features/ProfileForm'; // Form component
import Card from '../components/ui/Card'; // Reusable Card component
import Button from '../components/ui/Button'; // Assuming a reusable Button component exists for consistency
import Spinner from '../components/ui/Spinner'; // Assuming a reusable Spinner component

/**
 * Renders the profile editing page, allowing users to update their information
 * and delete their account.
 */
const ProfileEditPage = () => {
  // --- Hooks ---
  const {
    user,                 // Current user data { id, email, name, avatar?, ... }
    updateUserContext,    // Function from context to update user profile
    deleteUserAccountContext, // Function from context to delete user account
    logout,               // Function from context to log out
    isProfileLoading,     // Loading state for profile operations from context
    authError,            // Potential error messages from context
    setAuthError          // Function to set/clear error messages in context
  } = useAuth();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [isDeleting, setIsDeleting] = useState(false); // Local loading state for delete action

  // --- Effects ---
  // Clear any existing auth errors when the component mounts or unmounts
  useEffect(() => {
    return () => {
      setAuthError(null);
    };
  }, [setAuthError]);

  // --- Event Handlers ---
  /**
   * Handles the submission of the profile update form.
   * Calls the updateUserContext function and navigates on success.
   * @param {object} updateData - Data submitted from the ProfileForm
   */
  const handleProfileUpdate = useCallback(async (updateData) => {
    console.log("ProfileEditPage: Submitting update data:", updateData);
    setAuthError(null); // Clear previous errors before new action
    const success = await updateUserContext(updateData);
    if (success) {
      toast.success("¡Perfil actualizado con éxito!");
      // Consider navigating immediately or after a short delay
       navigate('/dashboard'); // Navigate back to dashboard on success
      // setTimeout(() => navigate('/dashboard'), 1500); // Optional delay
    }
    // Error handling is managed within updateUserContext which updates authError
  }, [updateUserContext, navigate, setAuthError]);

  /**
   * Handles the click event for the 'Delete Account' button.
   * Shows a confirmation dialog and calls the deleteUserAccountContext function.
   */
  const handleDeleteAccount = useCallback(async () => {
    // **Critical:** Confirm this irreversible action
    const confirmationMessage =
      '¿Estás ABSOLUTAMENTE seguro de que quieres eliminar tu cuenta?\n\n' +
      'Todos tus datos serán eliminados permanentemente. ¡Esta acción no se puede deshacer!';

    if (!window.confirm(confirmationMessage)) {
      return; // User cancelled
    }

    setIsDeleting(true);  // Set loading state
    setAuthError(null);   // Clear previous errors

    const success = await deleteUserAccountContext(); // Call context function

    setIsDeleting(false); // Reset loading state

    if (success) {
      // Success message and redirection are handled within deleteUserAccountContext/logout
      // If logout doesn't redirect automatically, navigate here:
      // navigate('/login', { replace: true });
    }
    // Error messages are handled within deleteUserAccountContext via toast and setAuthError
  }, [deleteUserAccountContext, setAuthError /*, navigate*/]);


  // --- Render Logic ---

  // Display loading skeleton if user data is not yet available
  // Note: isProfileLoading from context might be more accurate if available for initial load
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        {/* Basic Spinner or more detailed Skeleton */}
        <Spinner size="lg" />
      </div>
      // Previous Skeleton code:
      // <div className="flex justify-center items-center h-64"> ... </div>
    );
  }

  // Main component render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-4 py-8 md:py-12" // Added padding
    >
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          <FaArrowLeft className="mr-2 h-3 w-3" /> Volver al Dashboard
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Editar Perfil</h1>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-1 ring-blue-200">
            <FaUserEdit className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Actualiza tu información personal y contraseña.</p>
      </div>

      {/* Profile Update Card */}
      <Card className="p-6 md:p-8 shadow-lg rounded-xl border border-gray-100 bg-white mb-8 md:mb-10">
        {/* Avatar Section (Example) */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 mb-3 overflow-hidden border-4 border-white shadow-md ring-1 ring-gray-200">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'Avatar de usuario'}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold">{(user.name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}</span>
            )}
            {/* Optional: Edit icon overlay */}
             {/* <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow border border-gray-200 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
               <FaUserEdit className="h-3 w-3 text-gray-600"/>
             </button> */}
          </div>
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
            onClick={() => toast.error('Cambio de foto no implementado aún.')} // Placeholder action
          >
            Cambiar foto
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-6 md:mb-8" />

        {/* Profile Update Form */}
        <ProfileForm
          user={user} // Pass current user data to prefill form
          onSubmit={handleProfileUpdate} // Pass handler function
          isLoading={isProfileLoading && !isDeleting} // Loading state from context (only if not deleting)
          apiError={authError} // Pass potential API errors to the form
        />
      </Card>

      {/* Danger Zone - Delete Account Section */}
      <div className="mt-8 p-6 rounded-xl bg-red-50 border border-red-200">
        <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
          <FaExclamationTriangle className="mr-2 text-red-600" />
          Zona de Peligro
        </h2>
        <p className="text-sm text-red-700 mb-4">
            Esta acción es irreversible. Por favor, asegúrate antes de continuar.
        </p>

        {/* Delete Account Button */}
        {/* Using a reusable Button component is preferred if available */}
        <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting || isProfileLoading} // Disable if deleting or another profile action is loading
            className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
              isDeleting || isProfileLoading
                ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700'
            }`}
          >
          {isDeleting ? (
            <>
              <Spinner size="sm" className="mr-2" color="text-gray-500"/> Eliminando cuenta...
            </>
          ) : (
            <>
              <FaTrashAlt className="mr-2 h-4 w-4" /> Eliminar mi cuenta permanentemente
            </>
          )}
        </button>
        {/* Display specific delete error if available */}
         {authError && isDeleting && ( // Show error only if it occurred during deletion attempt
             <p className="mt-2 text-sm text-red-600 text-center">{authError}</p>
         )}
      </div>
    </motion.div>
  );
};

export default ProfileEditPage;