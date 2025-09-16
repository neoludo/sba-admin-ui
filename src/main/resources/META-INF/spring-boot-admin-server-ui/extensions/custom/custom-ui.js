// Define the Vue component as a global variable
window.customEndpoint = {
    template: `
    <div class="custom">
      <p>Instance: <span v-text="instance.id"></span></p>
      <p>Output: <span v-html="text"></span></p>
    </div>
  `,
    props: {
        instance: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        text: "",
    }),
    async created() {
        console.log(this.instance);
        this.text = "It works !!!";
    },
};

SBA.use({
    install({viewRegistry}) {
        viewRegistry.addView({
            name: "instances/custom",
            parent: "instances", // (1)
            path: "custom",
            component: customEndpoint,
            label: "Custom",
            group: "Details", // (2)
            order: 1000,
            isEnabled: ({instance}) => {
                return true;
            }, // (3)
        });
    }
});
