<template>
    <div class="{{ componentName }}">
        Component {{ componentNamePascal }}
    </div>
</template>

<script>
export default {
  name: '{{ componentNamePascal }}'
};
</script>

<style lang="postcss" scoped>
.{{ componentName }} {
    display: block;
}
</style>