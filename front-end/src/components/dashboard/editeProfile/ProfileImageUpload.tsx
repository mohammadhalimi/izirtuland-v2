// src/components/admin/dashboard/profile/ProfileImageUpload.tsx
import { component$ } from '@builder.io/qwik';
import { ProfileImageUploadProps } from '~/components/types/editeProfile';

export const ProfileImageUpload = component$<ProfileImageUploadProps>(({
  previewUrl,
  selectedFile,
  isUploading,
  currentUsername,
  onFileSelect,
  onUpload
}) => {
  return (
    <div class="bg-white rounded-2xl shadow-lg border border-green-200 p-6">
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-8 h-8 bg-linear-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600">
            📷
          </div>
          <h3 class="text-xl font-bold text-gray-800">عکس پروفایل</h3>
        </div>
        <p class="text-gray-600">عکس پروفایل خود را آپلود کنید</p>
      </div>

      <div class="flex flex-col md:flex-row items-center gap-6">
        {/* Image Preview */}
        <div class="shrink-0">
          <div class="relative">
            <div class="w-32 h-32 rounded-2xl border-4 border-green-200 overflow-hidden bg-linear-to-br from-green-50 to-emerald-50 shadow-lg">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  width={100}
                  height={100}
                  class="w-full h-full object-cover"
                />
              ) : (
                <div class="w-full h-full flex items-center justify-center">
                  <div class="text-4xl text-green-300 font-bold">
                    {currentUsername.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
            
            {/* Status Indicator */}
            {selectedFile && (
              <div class="absolute -top-2 -right-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                جدید
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div class="flex-1 space-y-4">
          {/* File Input */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              انتخاب عکس جدید
            </label>
            <div class="relative">
              <input
                type="file"
                accept="image/*"
                onChange$={onFileSelect}
                class="w-full px-4 py-3 border-2 border-dashed border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">
                📁
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              فرمت‌های مجاز: JPG, PNG, GIF • حداکثر حجم: ۵ مگابایت
            </p>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div class="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-800 mb-1">
                    فایل انتخاب شده
                  </p>
                  <p class="text-xs text-green-700 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-green-600 font-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p class="text-xs text-green-500 mt-1">
                    نوع: {selectedFile.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick$={onUpload}
            disabled={!selectedFile || isUploading}
            class="w-full md:w-auto bg-linear-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            {isUploading ? (
              <div class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>در حال آپلود...</span>
              </div>
            ) : (
              <div class="flex items-center justify-center gap-2">
                <span class="text-lg">📤</span>
                <span>آپلود عکس پروفایل</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-start gap-2 text-sm text-gray-600">
          <span class="text-green-500 mt-0.5">💡</span>
          <p>
            پیشنهاد می‌کنیم از عکس‌های مربعی با کیفیت بالا استفاده کنید. بهترین اندازه: ۴۰۰×۴۰۰ پیکسل
          </p>
        </div>
      </div>
    </div>
  );
});